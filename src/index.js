import Vue from "vue/dist/vue.esm.browser";
import { compileToFunctions } from "./compiler/index"; 
import template from "./demo/directive";


const { render } = compileToFunctions(template);

new Vue({
    template,
    //render,
    data(){
        return {
            name:"Hello",
            key:"style",
            color:'red',
            fontSize:"28px",
            colors:['red','green','blue'],
            visible:false,
            visible1:true
        }
    }
}).$mount(document.getElementById('container'));




