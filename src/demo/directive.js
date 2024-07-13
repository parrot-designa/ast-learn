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
 * let template = `<div v-if="visible">222</div>`;
 * 
*/ 


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
 * let template = `
        <div v-if="visible">222</div>
        <div v-else>444</div>
    `;
    let template = `
        <div v-if="visible">222</div>
        <div v-else-if="visible1">444</div>
    `;
 * 
*/


// =======================================  目前实现了非根元素的 vif velse velseif  =====================================================
/**
 * 目前实现了非根元素的 v-if和v-else -> 核心 if 和 ifConditions
 * 
 * ast = {
 *  children:[
 *     { 
 *       if:"visible",
 *       ifConditions:[
 *         {exp: "visible",block: 当前ast},
 *         {exp: undefined,block: 当前v-else对应的ast}
 *       ]
 *     }
 *  ]
 * }
 * 
 * code = _c('div',{},[(visible)?_c('div',{},[_v(222)]):_c('div',{},[_v(444)])])
 * 
 * let template = `
        <div id="root"> 
            <div v-if="visible">111</div>
            <div v-else-if="visible1">222</div>
            <div v-else="visible2">333</div>
        </div>
    `;
 */

// =======================================  目前实现了元素的 vbind && : =============================================
/**
 * 目前实现了元素的 vbind:[dynamic] && :[dynamic]
 * 
 * ast = {
 *  attrs:[
 *      { name:'src',value:'url' }
 *  ],
 *  hasBindings:true
 * }
 *  
 * code = _c('img',{attrs:{src:url}})
 * 
 */

// =======================================  目前实现了绑定动态属性元素的 [] =============================================
/**
 * 目前实现了元素的 []
 * 
 * ast = {
 *  dynamicAttrs:[
 *   { name:'dynamicKey',value:'url',dynamic:true}
 *  ]
 * }
 * 
 * code = _c('img',_b({},\"img\",_d({},[dynamicKey,url])))
 * 
 * let template = `
        <img 
            :[dynamicKey]="url" 
        />
    `
 */

// =======================================  目前实现了vshow =============================================
/**
 *   
 * ast = { 
 *  directives:[
 *   { name:'show',rawName:'v-show',isDynamicArg:false,value:visible}
 *  ]
 * }
 * 
 * code = _c('div',{directives:[{name:\"show\", rawName:\"v-show}\",value:(visible),expression:\"visible\"}]},[_v(\"测试\")])
 * 
 * let template = `
            <div  v-show="visible">测试</div>
    `
 */

// =======================================  目前实现了vtext =============================================
/**
 *   
 * ast = { 
 *  directives:[
 *   { name:'show',rawName:'v-show',isDynamicArg:false,value:visible}
 *  ]
 * }
 * 
 * code = _c('div',{directives:[{name:\"show\", rawName:\"v-show}\",value:(visible),expression:\"visible\"}]},[_v(\"测试\")])
 * 
 * 
 */
let template = `
    <div v-show="visible">测试</div>
`

export default template;