import Vue from "vue/dist/vue.esm.browser";
import { parse } from "./parse";

let template = `<div v-if="true" style="color:red;">{{name}} 222</div>`;
let unaryTemplate = `<img />`

new Vue({
    template,
    data(){
        return {
            name:"Hello",
            key:"style"
        }
    }
}).$mount(document.getElementById('container'));

const ast = parse(template);
debugger;


