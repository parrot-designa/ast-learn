"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genHandlers = genHandlers;
var _helpers = require("../helpers");
function genHandlers(events, isNative) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = "";
  for (var name in events) {
    var handlerCode = genHandler(events[name]);
    staticHandlers += "\"".concat(name, "\":").concat(handlerCode, ",");
  }
  staticHandlers = "{".concat(staticHandlers.slice(0, -1), "}");
  return prefix + staticHandlers;
}
function genHandler(handler) {
  if (!handler) {
    return 'function(){}';
  }
  if (Array.isArray(handler)) {
    return "[".concat(handler.map(function (handler) {
      return genHandler(handler);
    }).join(','), "]");
  }
  // 判断是否是一个有效的方法路径
  var isMethodPath = _helpers.simplePathRE.test(handler.value);
  // 判断是否是一个函数表达式
  var isFunctionExpression = _helpers.fnExpRE.test(handler.value);
  // 测试 handler.value 是否是一个函数调用，如 'myFunction()'
  var isFunctionInvocation = _helpers.simplePathRE.test(handler.value.replace(_helpers.fnInvokeRE, ''));
  if (!handler.modifiers) {
    // 如果 handler.value 是一个方法路径或函数表达式，直接返回 handler.value。
    if (isMethodPath || isFunctionExpression) {
      return handler.value;
    }
    /**
     * 如果 handler.value 是一个函数调用，将其包装在一个函数表达式中，并添加一个 return 语句。
     * 如果它不是函数调用，仍然将其包装在函数表达式中，但不添加 return。
     * */
    return "function($event){".concat(isFunctionInvocation ? "return ".concat(handler.value) : handler.value, "}");
  }
}