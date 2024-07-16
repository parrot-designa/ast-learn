import { genElement } from "./ast-element";

export function genDirectives(
    el,
    state
){
    const dirs = el.directives
    if(!dirs) return;
    let res = 'directives:['
    let hasRuntime = false;
    let i,l,dir,needRuntime ;
    for(i = 0,l = dirs.length; i < l; i++){
        dir = dirs[i]
        needRuntime = true;

        /**
         * 内置的一些指令在生成data时不需要添加directive
         */
        const gen = state.directives[dir.name];
        if(gen){
            needRuntime = !!gen(el, dir)
        }

        if(needRuntime){
            hasRuntime = true
            res += `{name:"${dir.name}", rawName:"${dir.rawName}"${
                dir.value
                    ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}`
                    : ''
            }},`
        }
    }
    if (hasRuntime) {
        return res.slice(0, -1) + ']'
    }
}

export function genIf(
    el,
    state
){
    el.ifProcessed = true 
    return genIfConditions(el.ifConditions.slice(), state)
}

export function genIfConditions(
    conditions,
    state
){
    if (!conditions.length) {
        /**
         * _e() 是一个用于生成空的虚拟 DOM 节点（vnode）的辅助函数。它的全名实际上是 createEmptyNode()。
         */
        return '_e()'
    } 
    const condition = conditions.shift()
    /**
     * v-else 时 没有exp
     */
    if(condition.exp){
        return `(${condition.exp})?${genTernaryExp(
            condition.block
        )}:${genIfConditions(conditions, state)}`
    }else{
        return `${genTernaryExp(condition.block)}`
    }

    function genTernaryExp(el) {
        return genElement(el, state)
    }
}

export function genFor(el,state){
    const exp = el.for
    const alias = el.alias
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

    el.forProcessed = true 
    return (
        `_l((${exp}),` +
        `function(${alias}${iterator1}${iterator2}){` +
        `return ${genElement(el, state)}` +
        '})'
    )
}

export function genOnce(el, state) {
    el.onceProcessed = true
    if (el.if && !el.ifProcessed) {
        return genIf(el, state)
    }else{
        return genStatic(el,state)
    }
}

function genStatic(el, state) {
    el.staticProcessed = true
    // Some elements (templates) need to behave differently inside of a v-pre
    // node.  All pre nodes are static roots, so we can use this as a location to
    // wrap a state change and reset it upon exiting the pre node. 
    state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
    return `_m(${state.staticRenderFns.length - 1})`
}