"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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

// =======================================  vmodel 实现input/textarea  ============================================
/**
 * 
 * ast = {
 *  directives:[{name:'model',rawName:'v-model',value:'name'}],
 *  events:{input:{value:"if($event.target.composing)return;name=$event.target.value"}},
 *  props:[{name:'value',value:'(name)'}]
 * }
 * 
 * code = _c('input',{directives:[{name:"model", rawName:"v-model}",value:(name),expression:"name"}],domProps:{"value":(name)},on:{"input":function($event){if($event.target.composing)return;name=$event.target.value}}})
 * 
 * let template = `
        <input v-model="name" />
    `
 */

// =======================================  vmodel 实现select  ============================================
/**
 * 
 * ast = {
 *  directives:[{name:'model',rawName:'v-model',value:'selectValue'}],
 *  events:{change:{value:"var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); selectValue=$event.target.multiple ? $$selectedVal : $$selectedVal[0]"}},
 * }
 * 
 * code = _c('select',{directives:[{name:"model", rawName:"v-model",value:(selectValue),expression:"selectValue"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); selectValue=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},[_c('option',{attrs:{"value":"1"}},[_v("1")]),_v(" "),_c('option',{attrs:{"value":"2"}},[_v("2")])])
 * 
    let template = `
        <select v-model="selectValue">
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
    `
 */

// =======================================  vmodel 实现checkbox  ============================================
/**
 * 
 * ast = {
 *  children:[
 *   {
 *    directives:[
 *     {name:"model",rawName:"v-model",value:"fruits"}
 *    ],
 *    events:[
 *     {change:{value:"var $$a=fruits,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="苹果",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(fruits=$$a.concat([$$v]))}else{$$i>-1&&(fruits=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{fruits=$$c}"}}
 *    ],
 *    props:[
 *     {name:"checked",value:"Array.isArray(fruits)?_i(fruits,"苹果")>-1:(fruits)"}
 *    ]
 *   }
 *  ]
 * }
 * 
 * code = "_c('div',[_c('input',{directives:[{name:"model", rawName:"v-model",value:(fruits),expression:"fruits"}],attrs:{"type":"checkbox","id":"apple","value":"苹果"},domProps:{"checked":Array.isArray(fruits)?_i(fruits,"苹果")>-1:(fruits)},on:{"change":function($event){var $$a=fruits,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="苹果",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(fruits=$$a.concat([$$v]))}else{$$i>-1&&(fruits=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{fruits=$$c}}}}),_v(" "),_c('label',{attrs:{"for":"apple"}},[_v("苹果")]),_c('br'),_v(" "),_c('input',{directives:[{name:"model", rawName:"v-model",value:(fruits),expression:"fruits"}],attrs:{"type":"checkbox","id":"banana","value":"香蕉"},domProps:{"checked":Array.isArray(fruits)?_i(fruits,"香蕉")>-1:(fruits)},on:{"change":function($event){var $$a=fruits,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="香蕉",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(fruits=$$a.concat([$$v]))}else{$$i>-1&&(fruits=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{fruits=$$c}}}}),_v(" "),_c('label',{attrs:{"for":"banana"}},[_v("香蕉")]),_c('br')])"
 * 
 * let template = `
    <div>
        <input type="checkbox" id="apple" value="苹果" v-model="fruits">
        <label for="apple">苹果</label><br>
        <input type="checkbox" id="banana" value="香蕉" v-model="fruits">
        <label for="banana">香蕉</label><br>
    </div>
`
 */

// =======================================  vmodel 实现radio  ============================================
/**
 * 
 * ast = {
 *  children:[
 *   {
 *    directives:[
 *     {name:"model",rawName:"v-model",value:"fruit"}
 *    ],
 *    events:{
 *     change:{
 *      value:"fruit=\"苹果\""
 *     }
 *    },
 *    props:[
 *     {name:"checked",value:"_q(fruit,\"苹果\")"} 
 *    ]
 *   }
 *  ]
 * }
 * 
 * code = _c('div',[_c('input',{directives:[{name:"model", rawName:"v-model",value:(fruit),expression:"fruit"}],attrs:{"type":"radio","id":"apple","value":"苹果"},domProps:{"checked":_q(fruit,"苹果")},on:{"change":function($event){fruit="苹果"}}}),_v(" "),_c('label',{attrs:{"for":"apple"}},[_v("苹果")]),_c('br'),_v(" "),_c('input',{directives:[{name:"model", rawName:"v-model",value:(fruit),expression:"fruit"}],attrs:{"type":"radio","id":"banana","value":"香蕉"},domProps:{"checked":_q(fruit,"香蕉")},on:{"change":function($event){fruit="香蕉"}}}),_v(" "),_c('label',{attrs:{"for":"banana"}},[_v("香蕉")]),_c('br')])
 * 
 * let template = `
        <div>
            <input type="radio" id="apple" value="苹果" v-model="fruit">
            <label for="apple">苹果</label><br>
            <input type="radio" id="banana" value="香蕉" v-model="fruit">
            <label for="banana">香蕉</label><br>
        </div>
    `
 * 
 */

// =======================================  vpre  ============================================
/**
 * 
 * ast = {
 *  children:[
 *   {type:3,text:"{{ this will not be compiled }}"}
 *  ]
 * }
 * 
 * code="_c('span',{attrs:{"v-if":"false"}},[_v("{{ this will not be compiled }}")])"
 * 
 * let template = `
        <span v-pre v-if="false">{{ this will not be compiled }}</span>
    `
 */

// =======================================  vonce  ============================================
/**
 * 
 * ast = {
 *  children:[
 *   {once:true}
 *  ]
 * }
 * 
 * code = "_c('div',[_m(0),_v(\" \"),_c('button',{on:{\"click\":function($event){name = name+='1'}}},[_v(\"修改name\")])])"
 * 
 * staticRenderFns = ["with(this){return _c('span',[_v(_s(name))])}"]
 * 
 * let template = `
    <div>
        <span v-once>{{ name }}</span>
        <button @click="name = name+='1'">修改name</button>
    </div>
    `
 * 
 */

var template = "\n<div>\n    <span v-once>{{ name }}</span>\n    <button @click=\"name = name+='1'\">\u4FEE\u6539name</button>\n</div>\n";
var _default = exports["default"] = template;