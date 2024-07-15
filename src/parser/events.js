import { emptyObject } from "../helpers"

export function addHandler(
    el,
    name,
    value,
    modifiers,
    dynamic
  ) {  

    modifiers = modifiers || emptyObject
    // 只当点击鼠标右键时触发
    if (modifiers.right) {
      if (dynamic) {
        name = `(${name})==='click'?'contextmenu':(${name})`
      } else if (name === 'click') {
        name = 'contextmenu'
        delete modifiers.right
      }
      // 只当点击鼠标中键时触发
    } else if (modifiers.middle) {
      if (dynamic) {
        name = `(${name})==='click'?'mouseup':(${name})`
      } else if (name === 'click') {
        name = 'mouseup'
      }
    }
  
    // 添加事件侦听器时使用 capture 模式。
    if (modifiers.capture) {
      delete modifiers.capture
      name = prependModifierMarker('!', name, dynamic)
    }
    // 只触发一次回调
    if (modifiers.once) {
      delete modifiers.once
      name = prependModifierMarker('~', name, dynamic)
    }
    // 模式添加侦听器
    if (modifiers.passive) {
      delete modifiers.passive
      name = prependModifierMarker('&', name, dynamic)
    }
  
    let events
    // 监听组件根元素的原生事件
    if (modifiers.native) {
      delete modifiers.native
      events = el.nativeEvents || (el.nativeEvents = {})
    } else {
      events = el.events || (el.events = {})
    }
  
    const newHandler = { value: value.trim(), dynamic }
    if (modifiers !== emptyObject) {
      newHandler.modifiers = modifiers
    }
  
    const handlers = events[name]
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler)
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
    } else {
      events[name] = newHandler
    }
  
    el.plain = false
}

function prependModifierMarker(
    symbol,
    name,
    dynamic
) {
    return dynamic ? `_p(${name},"${symbol}")` : symbol + name // mark the event as captured
}