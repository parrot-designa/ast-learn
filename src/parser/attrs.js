import { dirRE,addAttr, bindRE,dynamicArgRE } from "../helpers";
import { parseFilters } from "../parser/filter-parse";

/**
 * 给ast上增加attr属性
 * 
 * attrsList指的是所有属性
 * attrsMap指的是所有属性的map映射
 * 而attrs 指的是
 */
export function processAttrs(
    el
){
    const list = el.attrsList;
    let i,l,name,rawName,value,isDynamic;
    for(i = 0,l = list.length; i < l; i++){
        name = rawName = list[i].name;
        value = list[i].value

        // 匹配到指令
        if(dirRE.test(name)){
            el.hasBindings = true;

            // 匹配到bind
            if(bindRE.test(name)){
                name = name.replace(bindRE, '')
                value = parseFilters(value)
                isDynamic = dynamicArgRE.test(name)
                if (isDynamic) {
                    // 去掉[ ]
                    name = name.slice(1, -1)
                }
            }
            addAttr(el, name, value, list[i], isDynamic)
        } else{
            addAttr(el, name, JSON.stringify(value), list[i]);
        }
    }
}