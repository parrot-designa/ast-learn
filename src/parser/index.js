import { parseHTML } from "./html-parser";
import { parseText } from "./text-parser";
import { pluckModuleFunction,getAndRemoveAttr } from "../helpers";
import { processAttrs } from "./attrs";
import { processIf,processFor,processIfConditions } from "./directive";

let transforms

/**
 * 将HTML字符串转化为ast
 */
export function parse(template,options){
    const stack = []
    /**
     * 是否保留空格
     */
    const preserveWhitespace = options.preserveWhitespace !== false;
    let root,
        /**
         * currentParent变量的作用是跟踪当前正在构建的DOM树中的父节点。
         * 在解析模板并生成抽象语法树（Abstract Syntax Tree，简称AST）的过程中，currentParent帮助维护正确的节点层次关系。
         * 当你看到currentParent = element;这条语句时，这意味着一个新的元素节点element已经被创建，
         * 并且由于它不是一个自闭合标签（由unary变量判断），它将成为新的父节点。这意味着接下来解析到的任何子元素都将被添加为element的子节点。
         * 
         * 1. 当解析器遇到一个开始标签<tag>时，它会创建一个与之对应的AST节点，并检查这个节点是否是自闭合的。
         *      如果不是自闭合的，那么它将被设置为当前的父节点，即将currentParent指向这个新创建的element。
         * 2. 然后，解析器会继续解析模板中的内容，遇到的任何子元素都会被添加到currentParent的子节点列表中。
         * 3. 当解析到结束标签</tag>时，解析器会根据栈中存储的信息回溯到上一个父节点，即currentParent会更新为栈中element的父节点
         */
        currentParent,
        /**
         * inPre是一个标志变量，用于标记解析器当前是否处于处理<pre>标签内部的内容状态。
         * <pre>标签在HTML中用于预格式化文本，其中的文本通常会保留所有的空格和换行。
         * 
         * 当Vue的解析器遇到<pre>标签时，它会将inPre设置为true，这会改变Vue解析和处理模板内容的方式。
         * 具体来说，在<pre>标签内，Vue将不会对文本节点进行特殊处理，比如移除多余的空白字符，这是因为<pre>标签的特性就是保留所有原始的空白和换行。
         * 
         * 一旦解析器离开<pre>标签，即遇到</pre>，它会将inPre重新设置为false，恢复正常的模板解析行为。
         */
        inPre = false,
        /**
         * 和inPre类似 处理v-pre时使用
         */
        inVPre = false;

    transforms = pluckModuleFunction(options.modules, 'transformNode')

    function closeElement(element){
        trimEndingWhitespace(element)

        element = processElement(element, options)

        /**
         * !stack.length 检查的是 stack 是否为空，即当前没有打开的元素。如果 stack 为空，这意味着我们正在处理的是根元素或一个独立的元素，它不在任何其他元素的内部。
         * 
         * element !== root 则检查当前处理的元素是否不是根元素。根元素是整个模板的顶级元素，通常解析器会在开始解析模板时创建一个根元素。
         * 
         * 结合这两个条件，!stack.length && element !== root 表达式的含义是检查当前处理的元素是否是根元素以外的顶层元素，也就是说，它不在任何其他元素内部，同时它本身也不是根元素。
         * 
         * 在 Vue.js 的模板中，通常应该只有一个根元素，所有其他元素都应该嵌套在根元素内。这个条件判断是为了检查模板是否遵循了这个规则。如果这个条件为真，意味着我们遇到了一个不应该作为顶层元素存在的元素，这可能是因为模板结构有误，例如有多个根元素或元素结构不完整。
         */
        if(!stack.length && element !== root){
            /**
             * 当根元素（root）已经定义了一个条件表达式 (root.if) 并且当前元素是 v-else-if 或 v-else 时，addIfCondition 会被调用以添加新的条件分支到已存在的条件链上。
             */
            if(root.if && (element.elseif || element.else)){
                addIfCondition(root, {
                    exp: element.elseif,
                    block: element
                })
            }else{
                console.error("组件模板应当恰好包含一个根元素")
            }
            
        } 

        if(currentParent){
            if (element.elseif || element.else) {
                processIfConditions(element, currentParent)
            }else{
                currentParent.children.push(element)
                element.parent = currentParent
            } 
        }
    }

    parseHTML(template, {
        start(tag, attrs, unary){ 
            let element = createASTElement(tag, attrs);

            if(inVPre){

            }else{
                processFor(element);
                processIf(element);
            }

            if(!root){
                /**
                 * 没有root 将root指向element
                 */
                root = element;
            }

            if(!unary){
                currentParent = element;
                stack.push(element);
            }else{
                closeElement(element);
            }
        },
        end(tag, start, end){
            const element = stack[stack.length - 1]

            stack.length -= 1
            currentParent = stack[stack.length - 1]
            closeElement(element)
        },
        chars(text,start,end){
            /**
             * char函数的主要作用是决定如何将文本添加到当前组件的子节点列表中
             * 如果没有当前组件 自然而然就是没用 即返回
             * 
             * 使用例子：
             * let template = `
             *       <div v-if="visible">222</div>
             *       <div v-else>444</div>
             * `;
             * 上面例子中，解析完第一个div后，currentParent为undefined，再进行分割时，分割出空格或者其他字符 应该不进行处理
             */
            if(!currentParent){
                return ;
            }
            const children = currentParent.children;
            // 判断文本不为空
            if(text.trim()){

            //  空文本节点 且 是处理的第一个子元素
            } else if(!children.length){
                text = '';
            } else {
                text = preserveWhitespace ? ' ' :'';
            }
            if(text){
                let child,res;
                // 存在插值表达式
                if(!inVPre && text!== ' ' && (res = parseText(text))){
                    child = {
                        type:2,
                        expression: res.expression,
                        tokens: res.tokens,
                        text
                    }
                // 不存在插值表达式
                }else if(
                    text !== ' ' ||
                    !children.length ||
                    /**
                     * 用于检查当前正在处理的文本节点是否紧跟着一个非空格的文本节点
                     * 
                     * 1. 避免连续的空格节点
                     *  Vue.js 试图减少最终生成的 VDOM 中不必要的空格节点，因为连续的空格在 HTML 渲染时会被浏览器合并为一个空格，从而可能导致不必要的内存消耗和渲染负担。
                     *  通过这个判断，如果当前的文本节点是空格，且前一个文本节点也是空格，那么当前的空格节点就不会被添加到 children 数组中，从而避免了连续空格节点的产生。
                     * 
                     * 2.保持必要的空格
                     * 但是，如果当前的文本节点是空格，但前一个文本节点不是空格（或者 children 数组为空，意味着这是第一个文本节点），那么这个空格节点会被保留，因为它可能对布局有影响，例如在文本之间添加必要的间距。
                     */
                    children[children.length - 1].text !== ' '
                ){
                    child = {
                        type:3,
                        text
                    }
                }
                if(child){
                    children.push(child);
                }
            }
        }
    });

    /**
     * 在前端开发中，去除最后的空白文本节点（通常指的是空格或换行符）主要是出于以下几点考虑：
     * 1. 提高渲染效率
     * 浏览器在解析HTML时会自动合并相邻的空白字符为单个空格。
     * 这意味着，在大多数情况下，多个连续的空白字符实际上只会在页面上显示为一个空格，或者在某些情况下被完全忽略（例如在行内元素中，多余的空格可能不会显示）。
     * 因此，去除多余的空白节点可以减少虚拟DOM树的复杂度，提高渲染速度和内存使用效率。
     * 2. 简化DOM结构
     * 减少不必要的空白文本节点可以使DOM树更加简洁，这有助于更高效地操作DOM，尤其是在大型应用中，频繁的DOM操作可能会成为性能瓶颈。
     * 3. 保持一致性：
     * 在Vue.js等框架中，保持DOM结构的一致性和预期的行为是很重要的。
     * 例如，当动态更新DOM时，如果存在不必要的空白节点，可能会导致意外的布局变化或计算错误。
     * 4. 避免样式问题：
     * 在某些布局下，空白节点可能会影响元素的间距和对齐，特别是当涉及到CSS的white-space属性时。移除这些空白节点可以帮助避免潜在的样式问题。
     * 5. 提升可读性：
     * 对于开发人员来说，一个干净、没有多余空白的DOM结构更容易阅读和理解。
     */
    function trimEndingWhitespace(el) {
        // remove trailing whitespace node
        if (!inPre) {
          let lastNode
          while (
            (lastNode = el.children[el.children.length - 1]) &&
            lastNode.type === 3 &&
            lastNode.text === ' '
          ) {
            el.children.pop()
          }
        }
    }

    return root;
}

/**
 * 能够去除重复属性
 */
function makeAttrsMap(attrs){
    const map = {};
    for(let i = 0, l = attrs.length; i < l; i++){
        map[attrs[i].name] = attrs[i].value;
    }
    return map;
}

export function createASTElement(
    tag,
    attrs,
    parent
){
    return {
        type:1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent,
        children:[]
    }
}

export function processElement(element, options){

    element.plain =
        !element.key && !element.scopedSlots && !element.attrsList.length
        
    for (let i = 0; i < transforms.length; i++) {
        element = transforms[i](element, options) || element
    }
    processAttrs(element)
    return element;
}





