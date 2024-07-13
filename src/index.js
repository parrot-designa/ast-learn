import Vue from "vue/dist/vue.esm.browser";
import { compileToFunctions } from "./compiler/index"; 
import template from "./demo/directive"; 

const { render } = compileToFunctions(template);

new Vue({
    template,
    // render,
    data(){
        return {
            name:"Hello",
            key:"style",
            color:'red',
            fontSize:"28px",
            colors:['red','green','blue'],
            visible:true,
            visible1:false,
            visible2:false,
            url:"https://marketplace.canva.cn/NsFNI/MADwRLNsFNI/1/thumbnail_large/canva-MADwRLNsFNI.jpg",
            dynamicKey:"src"
        }
    }
}).$mount(document.getElementById('container'));




