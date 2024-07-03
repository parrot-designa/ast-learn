/**
 * 用于匹配一系列 Unicode 字符集中的字符
 */
export const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
   * unicodeRegExp.source 是对正则表达式对象 unicodeRegExp 的源码字符串表示
   * source 属性返回创建正则表达式时使用的原始字符串，不包括正则表达式前面的斜杠 / 以及可能的标志（如 i 表示忽略大小写，m 表示多行模式等）
   * 1. 起始字符必须是字母（大写或小写）或下划线 _
   * 2. 后续字符可以是连字符 -，点 .，数字 0-9，下划线 _，字母 a-zA-Z，以及由 unicodeRegExp.source 匹配的任何Unicode字符。
   * 3. *：表示上述字符可以出现零次或多次。
*/ 
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
/**
 * qnameCapture 是一个正则表达式，它被设计用来捕获所谓的“限定名称”（Qualified Names，简称QNames）。
 * 在XML和其他类似的标记语言中，QNames用于标识元素和属性，它们可以包含一个可选的前缀和一个本地部分，两者之间用冒号（:）分隔。
 * 如果没有前缀，那么就只有本地部分。
 * 
 * 1. ${ncname}：这里引用了之前定义的 ncname 正则表达式，用于匹配非冒号开头的名称。
 *      ncname 可以匹配字母、数字、下划线、连字符、点以及一系列Unicode字符（由 unicodeRegExp 定义）。
 * 2. (?:${ncname}\\:)?：这部分是一个非捕获组（non-capturing group），由 (?: ... ) 表示，意味着它不会创建一个额外的捕获组。
 *      这个组中的内容是可选的，表示可能存在的前缀。${ncname}\\: 指的是 ncname 后跟一个冒号，表示前缀部分。
 * 3. ${ncname}：再次引用 ncname，用于匹配本地部分，也就是冒号后面的那部分名称。
 * 
 * 整个 qnameCapture 正则表达式的结构意味着它将匹配以下两种情况之一：
 * 1. 一个完整的 QName，包含前缀和本地部分，中间用冒号分隔。
 * 2. 仅包含本地部分的 QName，没有前缀。
 * 
 * 通过使用 () 来包围整个表达式，qnameCapture 创建了一个捕获组，这意味着当你使用这个正则表达式去匹配文本时，整个匹配到的 QName 将作为一个单独的组被捕获，便于后续处理和提取
 * 例如，如果有一个字符串 "prefix:localPart"，qnameCapture 将匹配整个 "prefix:localPart" 并将其作为一个捕获组返回；如果字符串是 "justLocal", 则会匹配 "justLocal" 作为捕获组。
 */
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
/**
 * 用于在字符串中匹配HTML或XML开始标签的开头部分
 * 1. ^：这是一个断言，表示匹配必须发生在输入字符串的开始位置。换句话说，startTagOpen 只会在字符串的最前面尝试匹配。
 * 2. <：字面量字符 <，用于匹配HTML/XML开始标签的开标签符号。
 * 3. ${qnameCapture}：这是嵌入的表达式，它会被解析为之前定义的 qnameCapture 正则表达式的源码。qnameCapture是用于匹配限定名称（Qualified Name，即元素名，可能包含前缀和本地名）的正则表达式。
 * 
 * 因此，startTagOpen 正则表达式将匹配满足以下条件的字符串：
 * 1. 开始于 < 符号。
 * 2. 紧接着 < 是一个有效的限定名称（QName），这可以是带有前缀的元素名，也可以是没有前缀的元素名。
 */
export const startTagOpen = new RegExp(`^<${qnameCapture}`)

/**
 * 用于匹配HTML或XML开始标签的结束部分，即 > 字符及其可能的前导空白字符，以及可选的结束标签斜杠 /
 * 
 * 具体地，startTagClose 正则表达式的各个组成部分解析如下：
 * 1. ^：断言，表示匹配必须从字符串的开始位置进行。
 * 2. \s*：匹配任意数量的空白字符（包括空格、制表符、换页符等）。这里的星号 * 表示前面的模式（即空白字符）可以出现零次或多次。
 * 3. (\/?)：一个非捕获组，用于匹配可选的斜杠 /。斜杠是HTML中自闭合标签（也称为自结束标签）的一部分，例如 <img src="image.jpg" />。括号内的问号 ? 表示斜杠出现的次数为零或一次，即斜杠是可选的。
 * 4. >：匹配开始标签的结束符号。
 * 
 * 因此，startTagClose 正则表达式将匹配以下几种模式：
 * 1. 仅一个 > 字符，前面可能有任意数量的空白字符，这通常用于普通开始标签的结束，例如 <div class="container">。
 * 2. /> 序列，前面也可能有任意数量的空白字符，这用于自闭合标签的结束，例如 <br /> 或 <meta charset="UTF-8" />。
 * 
 * 这个正则表达式在HTML或XML解析器中非常有用，因为它帮助解析器识别开始标签何时结束，以及该标签是否是自闭合的。一旦开始标签的结束部分被识别，解析器就可以相应地处理标签内容或属性，然后继续解析文档的其余部分。
 */
export const startTagClose = /^\s*(\/?)>/

/**
 * 1. ^：断言，表示匹配必须从字符串的开始位置进行。
 * 2. \s*：匹配任意数量的空白字符（包括空格、制表符、换页符等）。这里的星号 * 表示前面的模式（即空白字符）可以出现零次或多次。
 * 3. (?:v-[\w-]+:|@|:|#) 主要用于匹配几种不同的模式，通常在解析某种模板语言或标记语言（如Vue.js模板语法）时使用
 *     1. (?: ...): 这是非捕获括号，意味着这部分正则表达式不会创建一个捕获组。它只用于分组，但不保存匹配的结果。
 *     2. v-[\w-]+:: 这部分用于匹配形如 v-something: 的模式，其中 something 可以是由字母、数字、下划线或连字符组成的字符串。在Vue.js中，v- 前缀通常用于表示指令（Directives），如 v-if、v-for 等。这里的 + 表示至少匹配一个以上的字符。
 *     3. @: 这个字符在Vue.js模板语法中用于绑定事件处理器，例如 @click="doSomething"。
 *      
 */
export const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

export const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/