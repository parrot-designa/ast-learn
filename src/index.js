import Vue from "vue/dist/vue.esm.browser";
import { parse } from "./parse";

let template = `<div v-if="true" style="color:red;">{{name}} 222</div>`;

new Vue({
    template,
    data(){
        return {
            name:"hello",
            key:"style"
        }
    }
}).$mount(document.getElementById('container'));

parse(template);


