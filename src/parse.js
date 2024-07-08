import { parseHTML } from "./parseHTML";
import { parseText } from "./text-parser";
/**
 * 将HTML字符串转化为ast
 */
export function parse(template){
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

    function closeElement(element){
        if(currentParent){
            currentParent.children.push(element)
            element.parent = currentParent
        }
    }

    parseHTML(template, {
        start(tag, attrs, unary){
            let element = createASTElement(tag, attrs);

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

export function createASTElement(
    tag,
    attrs,
    parent
){
    return {
        type:1,
        tag,
        attrsList:attrs,
        parent,
        children:[]
    }
}