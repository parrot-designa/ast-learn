// 指令 

// =======================================  目前实现了vtext =============================================
/**
 *   
 * ast = { 
 *  directives:[
 *   { name:'text',rawName:'v-text',isDynamicArg:false,value:url}
 *  ],
 *  props:[
 *   { name:'textContent',value:'_s(url)'}
 *  ]
 * }
 * // 由此可以看出来v-text就是textContent的语法糖
 * _c('div',{domProps:{\"textContent\":_s(url)}},[_v(\"测试\")])
 * 
 * let template = `
        <div v-text="url">测试</div>
    `
 */

// =======================================  目前实现了vhtml=============================================
/**
 *   
 * ast = { 
 *  directives:[
 *   { name:'html',rawName:'v-html',isDynamicArg:false,value:"'我是谁'"}
 *  ],
 *  props:[
 *   { name:'innerHTML',value:'_s("我是谁")'}
 *  ]
 * }
 * // 由此可以看出来v-text就是textContent的语法糖
 * _c('div',{domProps:{\"innerHTML\":_s('我是谁')}},[_v(\"测试\")])
 * 
 * let template = `
        <div v-html="'我是谁'">测试</div>
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

// =======================================  vfor  ============================================
/**
 * 
 * ast = {
 *  plain: true,
 *  children:[
 *   {type:1,alias:'item',for:'list',plain:true,iterator1:'index',children:[{type:2,expression:'_s(item)',text:{{item}},tokens:[{{@binding:'item'}}]}] },
 *   {type:3,text:''},
 *   {type:1,children:[
 *     {type:3,text:"11"}
 *    ]
 *   },
 *  ]
 * }
 * 
 * code = "_c('div',[_l((list),function(item,index){return _c('div',[_v(_s(item))])}),_v(\" \"),_c('div',[_v(\"11\")])],2)"
 * 
 * let template = `
    <div>
        <div v-for="(item,index) in list">{{item}} </div>
        <div>11</div>
    </div>
    `
 */

// =======================================  vfor 优先级高于vif  ============================================
/**
 * 
 * ast = {
 *  children:[
 *   {alias:'item',children:[
 *     {expression:"_s(item)+\" \"+_s(index)",text:"{{item}} {{index}}",type:2,tokens:[{@binding: 'item'}," ",{@binding:"index"}]}
 *    ],
 *    for:"list",
 *    if:"index == 1",
 *    ifConditions:[{
 *     {exp:"index == 1",block:当前ast}
 *    }],
 *    iterator1:"index"
 *   }
 *  ]
 * }
 * 
 * 在生成code时先生成_l 再生成三元表达式
 * code = _c('div',[_l((list),function(item,index){return (index == 1)?_c('div',[_v(_s(item)+\" \"+_s(index))]):_e()}),_v(\" \"),_c('div',[_v(\"11\")])],2)
 * 
 * let template = `
    <div>
        <div v-for="(item,index) in list" v-if="index == 1">{{item}}</div>
        <div>11</div>
    </div>
    `
 */

// =======================================  von  ============================================
/**
 * 
 * ast = {
 *  events:{
 *   click:{
 *    value:"handleClick(false)"
 *   }
 *  }
 * }
 * 
 * code = _c('button',{on:{\"click\":function($event){return handleClick(false)}}},[_v(\"点击\")])
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
   
// =======================================  vmodel 实现input  ============================================
/**
 * 
 * ast = {
 *  directives:[{name:'model',rawName:'v-model',value:'name'}],
 *  events:{input:{if($event.target.composing)return;name=$event.target.value}},
 *  props:[{name:'value',value:'(name)'}]
 * }
 * 
 * code = _c('input',{directives:[{name:"model", rawName:"v-model}",value:(name),expression:"name"}],domProps:{"value":(name)},on:{"input":function($event){if($event.target.composing)return;name=$event.target.value}}})
 * 
 * let template = `
        <input v-model="name" />
    `
 */

let template = `
    <input v-model="name" />
`

export default template;