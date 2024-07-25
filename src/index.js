import Vue from "vue/dist/vue.esm.browser";
import { compileToFunctions } from "./compiler/index"; 
import template from "./demo/directive"; 
import App from './App';

const { render,staticRenderFns } = compileToFunctions(template);

new Vue({
    // template,
    render:(h)=>h(App),
    staticRenderFns,
    data(){
        return {
            // name:"吴家宝",
            // key:"style",
            // color:'red',
            // fontSize:"28px",
            // colors:['red','green','blue'],
            // visible:true,
            // visible1:false,
            // visible2:false,
            // url:"https://marketplace.canva.cn/NsFNI/MADwRLNsFNI/1/thumbnail_large/canva-MADwRLNsFNI.jpg",
            // dynamicKey:"src",
            // list:['🍎','🌰','🍌'],
            // fruits:['苹果','香蕉'],
            // fruit:"苹果",
            // selectValue:2
        }
    },
    methods:{
        handleClick:function(event){
            console.log("点击",event)
        }
    }
}).$mount(document.getElementById('container'));




