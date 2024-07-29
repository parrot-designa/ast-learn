"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genData = genData;
var _attrsProps = require("./attrs-props");
var _directive = require("./directive");
var _events = require("./events");
function genData(el, state) {
  var data = '{';
  /**
   * 在给定的 genData 函数中，通过循环调用 state.dataGenFns 数组中的每一个函数，这些函数每个都会返回一个字符串，这个字符串可能代表了一部分数据定义。
   * 这些部分被拼接起来形成一个更大的数据定义字符串。然而，在循环的过程中，每个返回的字符串后可能会自动添加逗号（,）以便于在拼接时方便地分隔每个部分。
   * 
   * {
   *   "key1": "value1",
   *   "key2": "value2",
   *   "key3": "value3",
  *  }
   */
  // 添加指令
  var dirs = (0, _directive.genDirectives)(el, state);
  if (dirs) data += dirs + ',';
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // 增加属性
  if (el.attrs) {
    data += "attrs:".concat((0, _attrsProps.genProps)(el.attrs), ",");
  }
  // dom 原生属性
  if (el.props) {
    data += "domProps:".concat((0, _attrsProps.genProps)(el.props), ",");
  }
  // 事件监听
  if (el.events) {
    data += "".concat((0, _events.genHandlers)(el.events, false), ",");
  }
  data = data.replace(/,$/, '') + '}';

  // 增加动态属性
  if (el.dynamicAttrs) {
    /**
     * _b：这个函数负责将一个对象的属性绑定到一个虚拟节点 (VNode) 的 data 对象上。
     * _d: 它的目的是处理动态绑定的属性或指令参数
     */
    data = "_b(".concat(data, ",\"").concat(el.tag, "\",").concat((0, _attrsProps.genProps)(el.dynamicAttrs), ")");
  }
  return data;
}