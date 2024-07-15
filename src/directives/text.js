import { addProp } from "../helpers";

export default function text(el,dir){
    if(dir.value){
        addProp(el, 'textContent', `_s(${dir.value})`)
    }
}