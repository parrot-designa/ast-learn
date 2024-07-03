import { 
    startTagOpen,
    startTagClose,
    dynamicArgAttribute,
    attribute
} from "./reg";

/**
 * 解析模板
 */
export function parseHTML(html){
    // 用于追踪上一次循环处理后剩余未解析的 HTML 字符串部分
    let last;
    while(html){
        last = html;

        let textEnd = html.indexOf('<');
        if(textEnd === 0){
            parseStartTag();
            break;
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
     */
    function advance(n){
        html = html.substring(n);
    }

    function parseStartTag(){
        const start = html.match(startTagOpen);
        console.log("parseStartTag==>", start);
        if(start){
            const match = {
                tagName:start[1],
                attrs:[]
            }
            advance(start[0].length)
            let end,attr

            attr = html.match(attribute)
            debugger;
            while(
                // 直到找到结束标签否则一直循环
                !(end = html.match(startTagClose))
                && (attr = html.match(dynamicArgAttribute))
            ){
                console.log(end,attr)
            }
            
            
        }
    }
}