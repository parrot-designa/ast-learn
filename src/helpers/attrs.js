export function addAttr(
    el,
    name,
    value,
    range,
    dynamic
){
    const attrs = dynamic
    ? el.dynamicAttrs || (el.dynamicAttrs = [])
    : el.attrs || (el.attrs = []);
    attrs.push({name, value, dynamic});
    // 一旦存在属性 就是不纯的
    el.plain = false;
}