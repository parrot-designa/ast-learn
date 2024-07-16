import { getAndRemoveAttr,stripParensRE,forAliasRE,forIteratorRE,extend,findPrevElement } from "../helpers"
import { } from "./index"

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


/**
 *  函数的目的是向给定的元素 el 添加一个条件表达式 condition，这些条件表达式会被存储在 el 的 ifConditions 属性中，该属性是一个数组，用于保存所有附加的条件。
 *  ifConditions 主要是在编译阶段处理嵌套的 v-if 和 v-else 以及 v-else-if 指令时使用的一个数据结构。
 *  它是一个数组，用于跟踪和管理这些条件指令的状态和逻辑，确保它们被正确地解析和转换成最终的渲染函数代码。
 * 
 *  当 Vue 编译器遇到 v-if 指令时，它会创建一个新的 ifCondition 对象并将其添加到 ifConditions 数组中。
 *  这个对象包含了与条件表达式相关的元数据，如表达式的字符串形式、对应的代码生成信息等。
 * 
 *  当编译器遇到 v-else-if 指令时，它会向最后一个未关闭的 ifCondition 添加一个新的 elseif 引用，并更新该 ifCondition 的状态。
 *  对于 v-else 指令，它会将 elseBlock 设置为指向当前块的引用。
 * 
 *  在遍历整个模板的过程中，ifConditions 数组会被用来追踪这些条件块的层级关系，直到所有的条件块都被处理完毕。
 *  一旦所有相关的 v-if, v-else-if, 和 v-else 都被处理，Vue 编译器就会生成对应的渲染函数代码，其中包含了条件分支的逻辑。
 */
export function addIfCondition(el, condition){
    if (!el.ifConditions) {
        el.ifConditions = []
    }
    el.ifConditions.push(condition)
}

export function processIfConditions(el, parent) {
    const prev = findPrevElement(parent.children)
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      })
    } else {
      console.error("在else 前面必须要有vif")
    }
}

// 处理v-pre
export function processPre(el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true
  }
}