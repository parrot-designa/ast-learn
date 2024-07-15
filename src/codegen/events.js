import { simplePathRE,fnExpRE,fnInvokeRE } from "../helpers";

export function genHandlers(
    events,
    isNative
){
    const prefix = isNative ? 'nativeOn:' : 'on:'
    let staticHandlers = ``

    for (const name in events) {
        const handlerCode = genHandler(events[name]);
        staticHandlers += `"${name}":${handlerCode},`
    }
    staticHandlers = `{${staticHandlers.slice(0, -1)}}`
    return prefix + staticHandlers;
}

function genHandler(
    handler
){
    if(!handler){
        return 'function(){}'
    }
    if (Array.isArray(handler)) {
        return `[${handler.map(handler => genHandler(handler)).join(',')}]`
    }
    // 判断是否是一个有效的方法路径
    const isMethodPath = simplePathRE.test(handler.value)
    // 判断是否是一个函数表达式
    const isFunctionExpression = fnExpRE.test(handler.value)
    // 测试 handler.value 是否是一个函数调用，如 'myFunction()'
    const isFunctionInvocation = simplePathRE.test(
      handler.value.replace(fnInvokeRE, '')
    )
    if (!handler.modifiers) {
        // 如果 handler.value 是一个方法路径或函数表达式，直接返回 handler.value。
        if (isMethodPath || isFunctionExpression) {
            return handler.value
        }
        /**
         * 如果 handler.value 是一个函数调用，将其包装在一个函数表达式中，并添加一个 return 语句。
         * 如果它不是函数调用，仍然将其包装在函数表达式中，但不添加 return。
         * */
        return `function($event){${
            isFunctionInvocation ? `return ${handler.value}` : handler.value
        }}`
    }
}