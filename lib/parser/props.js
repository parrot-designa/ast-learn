"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addProp = addProp;
function addProp(el, name, value, range, dynamic) {
  (el.props || (el.props = [])).push({
    name: name,
    value: value,
    dynamic: dynamic
  });
  el.plain = false;
}