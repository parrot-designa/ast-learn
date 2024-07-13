// ================================== 自闭合 ================================================================
/**
 * 
 * 自闭合标签在option.start时就直接调用closeElement处理element
 * 
 * ast = { 
 *  tag:"img"
 * }
 * 
 * code = _c('img',{}) // 属性还没写到
 * 
 */
let template = `<img />`

export default template;