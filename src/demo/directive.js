// 指令
 
// =======================================  目前实现了vif ==========================================================
/** 目前实现了vif -> 核心 if 和 ifConditions
 * 
 * ast = {
 *  if:"visible",
 *  ifConditions:[{
 *    exp:"visible",
 *    block: 当前这颗ast树
 *  }]
 * }
 * 
 * code = (visible)?_c('div',[_v(\"222\")]):_e()
 * 
*/
// let template = `<div v-if="visible">222</div>`;



// =======================================  目前实现了根元素的 vif velse velseif  ==========================================================
/** 目前实现了根元素的 v-if和v-else -> 核心 if 和 ifConditions
 * 
 * ast = {
 *  if:"visible",
 *  ifConditions:[
 *   { 
 *    exp:"visible",
 *    block: 当前这颗ast树
 *   },
 *   {
 *    exp:undefined, // 如果是else if 则为有值
 *    block:v-else的那个ast树
 *   }
 *  ]
 * }
 * 
 * code = (visible)?_c('div',{},[_v(222)]):_c('div',{},[_v(444)])
 * 
*/
// let template = `
//     <div v-if="visible">222</div>
//     <div v-else>444</div>
// `;
// let template = `
//     <div v-if="visible">222</div>
//     <div v-else-if="visible1">444</div>
// `;

export default template;