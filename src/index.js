import Vue from "vue/dist/vue.esm.browser";
import { compileToFunctions } from "./compiler/index"; 

/** 目前实现了静态style样式  -> 核心 staticStyle 属性 */ 
// let template = `<div style="color:red;font-size:18px">222</div>`; 
/** 目前实现了动态style样式 -> 核心 styleBinding 属性*/
// let template = `<div :style="{ color,fontSize }">222</div>`; 
/** 目前实现了静态class样式 -> 核心 staticClass 属性*/
// let template = `<div class="test">222</div>`; 
/** 目前实现了静态class样式 -> 核心 classBinding 属性*/
// let template = `<div :class="colors">222</div>`;
/** 目前实现了vif*/
let template = `<div v-if="visible">222</div>`;

const { render } = compileToFunctions(template);

new Vue({
    // template,
    render,
    data(){
        return {
            name:"Hello",
            key:"style",
            color:'red',
            fontSize:"28px",
            colors:['red','green','blue'],
            visible:false
        }
    }
}).$mount(document.getElementById('container'));




