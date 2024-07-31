"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAttr = addAttr;
function addAttr(el, name, value, range, dynamic) {
  var attrs = dynamic ? el.dynamicAttrs || (el.dynamicAttrs = []) : el.attrs || (el.attrs = []);
  attrs.push({
    name: name,
    value: value,
    dynamic: dynamic
  });
  // 一旦存在属性 就是不纯的
  el.plain = false;
}