import Vue from "vue/dist/vue.esm.browser";

new Vue({
    template:`<div style="color:red;">{{name}} 222</div>`,
    data(){
        return {
            name:"hello"
        }
    }
}).$mount(document.getElementById('container'));


