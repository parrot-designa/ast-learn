import { getAndRemoveAttr,stripParensRE,forAliasRE,forIteratorRE,extend } from "../helpers"

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

/**
 * 分别处理 v-if v-else v-else-if
 * @param {*} el 
 */
export function processIf(el) {
    const exp = getAndRemoveAttr(el, 'v-if')
    if (exp) {
      el.if = exp
      addIfCondition(el, {
        exp: exp,
        block: el
      })
    } else{
        if(getAndRemoveAttr(el, 'v-else') != null){
            el.else = true
        }
        const elseif = getAndRemoveAttr(el, 'v-else-if')
        if (elseif) {
            el.elseif = elseif
        }
    }
}

export function processFor(el){
    let exp;
    if((exp = getAndRemoveAttr(el, 'v-for'))){
        const res = parseFor(exp)
        if(res){
            extend(el, res)
        }
    }
}

export function parseFor(exp){
    const inMatch = exp.match(forAliasRE)
    if (!inMatch) return
    const res = {}
    res.for = inMatch[2].trim()
    const alias = inMatch[1].trim().replace(stripParensRE, '')
    const iteratorMatch = alias.match(forIteratorRE)
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '').trim()
      res.iterator1 = iteratorMatch[1].trim()
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim()
      }
    } else {
      res.alias = alias
    }
    return res
}