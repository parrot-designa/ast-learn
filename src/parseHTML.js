import { 
    startTagOpen,
    startTagClose,
    dynamicArgAttribute,
    attribute,
    endTag
} from "./reg";
import {
    isUnaryTag
} from "./util";

/**
 * 解析模板
 */
export function parseHTML(html,options={}){
    /**
     * 主要用于追踪和管理模板中的嵌套标签结构。
     * 当解析器遇到一个开始标签（例如 <div> 或 <p>）时，它会创建一个对象来描述这个标签的信息，如标签名、属性、开始和结束位置等，并将这个对象压入 stack 数组中。
     * 
     * 1. 标签压入：当解析器遇到一个开始标签时，它会将这个标签的信息作为一个对象放入 stack。这表示当前标签的开始，解析器现在处于这个标签的内部。
     * 2. 标签层级管理：stack 的顶部始终是当前正在处理的最内层的标签。每当遇到一个新的开始标签，它都会被压入 stack 的顶部，形成标签的嵌套关系。
     * 3. 标签弹出: 当解析器遇到一个结束标签（例如 </div> 或 </p>）时，它会检查 stack 的顶部对象，看是否与当前结束标签相匹配。如果匹配，
     *      表示当前标签的结束，解析器会从 stack 中移除（弹出）最顶层的对象，恢复到上一层级的标签环境。
     * 4. 错误检测: 如果 stack 为空时遇到结束标签，或者结束标签与 stack 顶部的开始标签不匹配，这通常表示模板中的标签没有正确闭合，解析器会抛出错误。
     * 5. 模板结构还原: 在整个解析过程中，stack 的状态反映了模板的结构。解析结束后，stack 应该为空，表示所有开始标签都被正确地闭合。
     */
    const stack = [];
    let index = 0;
    // 用于追踪上一次循环处理后剩余未解析的 HTML 字符串部分
    let last;
    while(html){
        last = html;

        /**
         * textEnd 变量用于标识HTML字符串中下一个 < 字符的位置。
         * 这个变量帮助确定了普通文本内容（非HTML标签）的结束位置。
         * 
         * 具体来说，textEnd 是通过调用 html.indexOf('<') 获得的，这会在给定的HTML字符串中查找第一个 < 字符的索引位置。
         * 如果 < 字符在字符串中存在，indexOf 方法会返回该字符的索引；如果不存在，则返回 -1。
         * 
         * 在模板解析的过程中，textEnd 的作用如下：
         * 
         * 1. 文本内容的界定：当 Vue 解析器在处理文本内容时，它需要知道文本何时结束以及何处开始解析HTML标签。
         *      textEnd 提供了这一信息，允许解析器区分文本内容和HTML标签。
         * 2. 性能优化：通过只扫描到下一个 < 字符的位置，解析器可以避免不必要的全字符串搜索，提高解析效率。
         *      一旦找到 < 字符，解析器就可以停止当前的文本读取，转而开始解析新的HTML标签。
         * 3. 错误处理：如果在某个点 html 字符串为空或 textEnd 等于 -1，这意味着字符串中不再有 < 字符，
         *      可能指示模板中存在未闭合的标签或格式错误。
         */
        let textEnd = html.indexOf('<');
        if(textEnd === 0){
            /**
             *  匹配  </...>  结束标签 必须以 </ 开始
             */ 
            const endTagMatch = html.match(endTag);
            if(endTagMatch){
                // 在截取字符串前保存当前下标
                const curIndex = index;
                advance(endTagMatch[0].length);
                parseEndTag(endTagMatch[1],curIndex,index);
                continue;
            }

            /**
             * 匹配 < 开始标签 必须以 < 开始
             */
            const startTagMatch = parseStartTag();
            if(startTagMatch){
                handleStartTag(startTagMatch);
                continue;
            }
        }
        let rest,text
        if(textEnd >= 0){
            rest = html.slice(textEnd)
            /**
             * 获取标签中的文字
             */
            text = html.substring(0, textEnd)
        }

        if (textEnd < 0) {
            text = html
        }

        if (text) {
            advance(text.length)
        }

        if(options.chars && text){
            options.chars(text, index - text.length,index);
        }
    }

    /**
     * advance 函数在这个上下文中是用来“前进”或“移动”HTML字符串解析的位置的。具体来说，这个函数通过截取字符串的子串，抛弃掉已经处理过的部分，从而让解析器关注于字符串的剩余部分。
     * 这里的参数 n 是一个整数，表示从当前字符串的起始位置开始向前移动的字符数量。substring(n) 方法会返回从索引 n 开始直到字符串结尾的子串，这就相当于“切掉”了字符串的前 n 个字符，使得 html 变量指向了剩下的未处理的字符串部分。
     * 在HTML解析器中，advance 函数通常在解析完一个元素（如标签、注释或文本节点）之后调用，以确保解析器接下来处理的是新元素的起始位置。
     * 举个例子，如果 html 最初是这样的：这样，随着解析过程的进行，html 字符串逐渐变短，直到最终完全被解析完毕。
     * <html><body><p>Hello World!</p></body></html>
     * 在解析器识别并处理完 <html> 和 <body> 标签后，假设总共处理了12个字符，那么调用 advance(12) 之后，html 的值就会变成
     * <p>Hello World!</p></body></html>
     * 现在解析器可以继续从 <p> 标签开始解析剩下的字符串。这就是 advance 函数的主要用途和意义。
     * 
     * 通过维护 stack，Vue 的解析器能够构建一个关于模板结构的抽象语法树（Abstract Syntax Tree，AST），这个 AST 后续会被用于生成对应的 VNode（虚拟节点），并最终渲染成真实的 DOM。AST 的构建过程依赖于 stack 来记录和管理标签的层级关系，确保每个开始标签都有对应的结束标签，从而保证模板的正确性和完整性。
     */
    function advance(n){
        index += n;
        html = html.substring(n);
    }

    function parseStartTag(){
        const start = html.match(startTagOpen);
        if(start){
            const match = {
                tagName:start[1],
                attrs:[]
            }
            advance(start[0].length)
            let end,attr 

            while(
                // 匹配不到开始标签对应的闭合标签 > 
                !(end = html.match(startTagClose))
                // 匹配到属性 或者动态属性
                && (attr = html.match(dynamicArgAttribute) || html.match(attribute))
            ){
                advance(attr[0].length)
                match.attrs.push(attr);
            }
            if(end){
                match.unarySlash = end[1]
                advance(end[0].length)
                return match;
            }
        }
    }

    function parseEndTag(tagName,start,end){
        let pos,lowerCasedTagName;
        if(tagName){
            lowerCasedTagName = tagName.toLowerCase();

            for(pos = stack.length - 1;pos >=0;pos-- ){
                if(stack[pos].lowerCasedTag === lowerCasedTagName){
                    break;
                }
            }
        }else{
            pos = 0;
        }
        if(pos >= 0){
            /**
             * 从栈的顶部开始遍历，一直遍历到找到的匹配开始标签的位置。
             * 这是因为，在HTML中，结束标签会闭合它自己以及它内部所有的开始标签，直到找到对应的开始标签为止。
             */
            for(let i = stack.length - 1; i>= pos;i--){
                if (options.end) {
                    options.end(stack[i].tag, start, end)
                }
            }
        }
    }

    function handleStartTag(match){
        const tagName = match.tagName;
        // 自闭合标签
        const unarySlash = match.unarySlash;
        // 是否是自闭合标签
        const unary = isUnaryTag(tagName) || !!unarySlash
        // 获取属性的数量
        const l = match.attrs.length
        // 初始化一个数组来存储标签的属性
        const attrs = new Array(l)
        for(let i = 0; i < l; i++){
            const args = match.attrs[i];
            /**
             * 1.不带引号的简单属性值：<div class=abc>
             * 2.带单引号的属性值：<div class='abc'>
             * 3.带双引号的属性值：<div class="abc">
             * 4.动态属性值：<div :class="someVariable">
             */
            const value = args[3] || args[4] || args[5] || ''
            attrs[i] = {
                name: args[1],
                value: value
            }
        }
        /**
         * 不是自闭合标签才推入栈中
         */
        if(!unary){
            stack.push({
                tag: tagName,
                lowerCasedTag: tagName.toLowerCase(),
                attrs
            });
        }
        
        if(options.start){
            options.start(tagName, attrs, unary)
        }
    }
}