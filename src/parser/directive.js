export function addDirective(
    el,
    name,
    rawName,
    value,
    arg,
    isDynamicArg
){
    (el.directives || (el.directives = [])).push(
        {
            name,
            rawName,
            value,
            arg,
            isDynamicArg
        }
    )
    el.plain = false
}