import { parseFilters } from "../parser/filter-parse";
/**
 *  从一组模块中提取特定的方法或属性，并返回一个只包含非空值的数组
 */
export function pluckModuleFunction(
    modules,
    key
){
    return modules ? (modules.map(m => m[key]).filter(_ => _)) : [];
}

/**
 *  主要功能是获取并移除一个给定元素的某个属性。
 *  这个函数通常在处理 HTML 元素的属性，尤其是在解析或编译模板时使用，例如在 Vue.js 中处理元素上的绑定或指令。
 */
export function getAndRemoveAttr(
    el,
    name
){
    let val
    if((val = el.attrsMap[name]) != null){
        const list = el.attrsList;
        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i].name === name) {
                list.splice(i, 1)
                break
            }
        }
    }
    return val
}

/**
 *  从一个元素 (el) 上获取特定绑定属性的值 getStatic 可以获取非bind的值
 */
export function getBindingAttr(
    el,
    name,
    // 获取普通的值
    getStatic
){
    const dynamicValue =
        getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
    if(dynamicValue != null){
        return parseFilters(dynamicValue);
    }else if(getStatic !== false){
        const staticValue = getAndRemoveAttr(el, name)
        if (staticValue != null) {
            return JSON.stringify(staticValue)
        }
    }
}

export * from './attrs';
export * from './reg';
export * from './util';
export * from '../parser/props';