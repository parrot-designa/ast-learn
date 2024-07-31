"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// ================================== 自闭合 ================================================================
/**
 * 
 * 自闭合标签在option.start时就直接调用closeElement处理element
 * 
 * ast = { 
 *  tag:"img"
 * }
 * 
 * code = _c('img',{}) // 属性还没写到
 * 
 * let template = `<img />`
 */

// ================================== 插值表达式 ================================================================
/** 
 * 
 * ast = { 
 *  tag:"div",
 *  children: [
 *   {type:2, expression:"\"   你好，\"+_s(name)",tokens:['   你好,',{@binding:'name'}],text:"   你好，{{ name }}"}
 *  ]
 * }
 * 
 * code = _c('div',{},[_v(\"   你好，\"+_s(name))])
 * 
 * let template = `<div>   你好，{{ name }}</div>`
 */

var template = "<div>   \u4F60\u597D\uFF0C{{ name }}</div>";
var _default = exports["default"] = template;