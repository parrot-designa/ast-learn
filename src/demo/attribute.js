// 属性

/** 目前实现了静态style样式  -> 核心 staticStyle 属性
 * 
 * ast = {
 *  tag:"div",
 *  staticStyle:"{\"color\":\"red\",\"font-size\":\"18px\"}",
 * }
 * 
 * code = _c('div',{staticStyle:{\"color\":\"red\",\"font-size\":\"18px\"}},[_v(222)])
 *  */ 
// let template = `<div style="color:red;font-size:18px">222</div>`; 
/** 目前实现了动态style样式 -> 核心 styleBinding 属性
 * 
 * ast = {
 *  tag:"div",
 *  styleBinding:"{ color,fontSize }"
 * }
 * 
 * code = _c('div',{style:({ color,fontSize })},[_v(222)])
 * 
*/
// let template = `<div :style="{ color,fontSize }">222</div>`; 
/** 目前实现了静态class样式 -> 核心 staticClass 属性
 * 
 * ast = {
 *  tag:"div",
 *  staticClass:"\"test\""
 * }
 * 
 * code = _c('div',{staticClass:\"test\"},[_v(222)])
 * 
*/
// let template = `<div class="test">222</div>`; 
/** 目前实现了静态class样式 -> 核心 classBinding 属性
 * 
 * ast = {
 *  tag:"div",
 *  classBinding:"colors"
 * }
 * 
 * code = _c('div',{class:colors},[_v(222)])
 * 
*/