import { parseHTML } from "./html-parser";
import { parseText } from "./text-parser";
import { pluckModuleFunction,getAndRemoveAttr } from "../helpers";

let transforms

/**
 * 将HTML字符串转化为ast
 */
export function parse(template,options){
    const stack = []
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

        element = processElement(element, options)

        if(currentParent){
            currentParent.children.push(element)
            element.parent = currentParent
        }
    }

    parseHTML(template, {
        start(tag, attrs, unary){
            let element = createASTElement(tag, attrs);

            if(inVPre){

            }else{
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
            }
        },
        end(tag, start, end){
            const element = stack[stack.length - 1]

            stack.length -= 1
            currentParent = stack[stack.length - 1]
            closeElement(element)
        },
        chars(text,start,end){
            const children = currentParent.children;
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
                    !children.length
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
    for (let i = 0; i < transforms.length; i++) {
        element = transforms[i](element, options) || element
    }
    return element;
}

function processIf(el) {
    const exp = getAndRemoveAttr(el, 'v-if')
    if (exp) {
      el.if = exp
      addIfCondition(el, {
        exp: exp,
        block: el
      })
    }
}
/**
 *  函数的目的是向给定的元素 el 添加一个条件表达式 condition，这些条件表达式会被存储在 el 的 ifConditions 属性中，该属性是一个数组，用于保存所有附加的条件。
 *  ifConditions 主要是在编译阶段处理嵌套的 v-if 和 v-else 以及 v-else-if 指令时使用的一个数据结构。
 *  它是一个数组，用于跟踪和管理这些条件指令的状态和逻辑，确保它们被正确地解析和转换成最终的渲染函数代码。
 * 
 *  当 Vue 编译器遇到 v-if 指令时，它会创建一个新的 ifCondition 对象并将其添加到 ifConditions 数组中。
 *  这个对象包含了与条件表达式相关的元数据，如表达式的字符串形式、对应的代码生成信息等。
 * 
 *  当编译器遇到 v-else-if 指令时，它会向最后一个未关闭的 ifCondition 添加一个新的 elseif 引用，并更新该 ifCondition 的状态。
 *  对于 v-else 指令，它会将 elseBlock 设置为指向当前块的引用。
 * 
 *  在遍历整个模板的过程中，ifConditions 数组会被用来追踪这些条件块的层级关系，直到所有的条件块都被处理完毕。
 *  一旦所有相关的 v-if, v-else-if, 和 v-else 都被处理，Vue 编译器就会生成对应的渲染函数代码，其中包含了条件分支的逻辑。
 */
export function addIfCondition(el, condition){
    if (!el.ifConditions) {
        el.ifConditions = []
    }
    el.ifConditions.push(condition)
}