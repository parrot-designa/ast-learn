import { addProp } from "../parser/props";
import { addHandler } from "../parser/events";

export default function model(
    el,
    dir
){
    const tag = el.tag;
    const value = dir.value;

    if(tag === 'input' || tag === 'textarea'){
      genDefaultModel(el, value)
    }
    return true;
}

function genDefaultModel(
    el,
    value
){
    const event = 'input';

    let valueExpression = '$event.target.value'

    let code = genAssignmentCode(value, valueExpression);

    /**
     * $event通常是一个代表事件对象的变量，它包含了关于触发事件的所有信息。
     * $event.target则指向触发该事件的DOM元素。
     * .composing属性是一个特定于某些浏览器的非标准属性，主要用于检测输入法编辑器（IME，Input Method Editor）的状态。
     * 当用户使用IME（如中文、日文或韩文输入法）输入文字时，IME会进入一个"组合"阶段，在这个阶段中，用户输入的字符会被暂时保存并可能进行修改，直到用户完成输入并提交最终的文字。
     * $event.target.composing用来检查目标元素是否正在处于IME的组合阶段。
     * 如果$event.target.composing为true，这意味着IME正在处理输入，因此执行return;将导致事件处理器提前退出，不会执行后续代码。
     * 如果目标元素当前正在通过IME进行文本输入，则直接返回，不执行下面的代码。
     */
    code = `if($event.target.composing)return;${code}`

    addProp(el, 'value', `(${value})`)
    addHandler(el, event, code, null)
}

export function genAssignmentCode(value, assignment){
    const res = parseModel(value)
    if (res.key === null) {
        return `${value}=${assignment}`
    } else {
        return `$set(${res.exp}, ${res.key}, ${assignment})`
    }
}

let len, str, chr, index, expressionPos, expressionEndPos

export function parseModel(val) {
    /**
     * 移除字符串 val 的前导和尾随空格，并获取其长度
     */
    val = val.trim()
    len = val.length

    /**
     * 检查字符串是否不包含方括号 [ 或者最后一个方括号是否在字符串末尾前一位
     * 符合则表示可能是用点语法来访问对象的属性
     */
    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
        index = val.lastIndexOf('.')
        /**
         * 如果字符串包含点语法，函数会将其分割成两部分：表达式（exp）和键（key）。
         * 键被包裹在双引号中，这是因为键需要被视为字符串
         */
        if (index > -1) {
          return {
            exp: val.slice(0, index),
            key: '"' + val.slice(index + 1) + '"'
          }
        /**
         * 如果字符串不包含点语法，那么整个字符串就是表达式，而键为 null。
         */
        } else {
          return {
            exp: val,
            key: null
          }
        }
    }
    str = val
    index = expressionPos = expressionEndPos = 0

    /**
     * 如果字符串包含方括号语法，那么 parseModel 函数会初始化一些变量，然后进入一个循环，直到到达字符串的末尾。
     */
    while (!eof()) {
        chr = next()
        /* istanbul ignore if */
        if (isStringStart(chr)) {
          parseString(chr)
        } else if (chr === 0x5b) {
          parseBracket(chr)
        }
    }
    return {
        exp: val.slice(0, expressionPos),
        key: val.slice(expressionPos + 1, expressionEndPos)
      }
}

/**
 *  指示是否已经到达了字符串的末尾
 */
function eof() {
    return index >= len
}

/**
 *  返回字符串中下一个字符的 ASCII 码值。
 */
function next() {
    return str.charCodeAt(++index)
}
/**
 *  检查一个字符是否是单引号 ' 或双引号 "，这是字符串开始的标志。
 */
function isStringStart(chr) {
    return chr === 0x22 || chr === 0x27
}

/**
 * 跳过一个字符串，直到再次遇到相同的引号。
 */
function parseString(chr) {
    const stringQuote = chr
    while (!eof()) {
      chr = next()
      if (chr === stringQuote) {
        break
      }
    }
}

/**
 * 解析方括号内的表达式，直到遇到匹配的方括号
 */
function parseBracket(chr) {
    let inBracket = 1
    expressionPos = index
    while (!eof()) {
      chr = next()
      if (isStringStart(chr)) {
        parseString(chr)
        continue
      }
      if (chr === 0x5b) inBracket++
      if (chr === 0x5d) inBracket--
      if (inBracket === 0) {
        expressionEndPos = index
        break
      }
    }
}
  