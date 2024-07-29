"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _helpers = require("../helpers");
function transformNode(el, options) {
  var staticClass = (0, _helpers.getAndRemoveAttr)(el, 'class');
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass.replace(/\s+/g, ' ').trim());
  }
  var classBinding = (0, _helpers.getBindingAttr)(el, 'class', false);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}
function genData(el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:".concat(el.staticClass, ",");
  }
  if (el.classBinding) {
    data += "class:".concat(el.classBinding, ",");
  }
  return data;
}
var _default = exports["default"] = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};