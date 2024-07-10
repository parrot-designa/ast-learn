import Vue from "vue/dist/vue.esm.browser";
import { parse } from "./parse";
import { generate } from "./codegen";

let template = `<div style="color:red;">{{name}} 222</div>`;
let unaryTemplate = `<img />`

const ast = parse(template);
const code = generate(ast); 
debugger;

new Vue({
    render:new Function(code.render),
    data(){
        return {
            name:"Hello",
            key:"style"
        }
    }
}).$mount(document.getElementById('container'));




