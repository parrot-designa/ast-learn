"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _helpers = require("../helpers");
var _util = require("../helpers/util");
// 用于生成ast时设置staticStyle
function transformNode(el) {
  var staticStyle = (0, _helpers.getAndRemoveAttr)(el, 'style');
  if (staticStyle) {
    el.staticStyle = JSON.stringify((0, _util.parseStyleText)(staticStyle));
  }
  var styleBinding = (0, _helpers.getBindingAttr)(el, 'style', false);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}
function genData(el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:".concat(el.staticStyle, ",");
  }
  if (el.styleBinding) {
    data += "style:(".concat(el.styleBinding, "),");
  }
  return data;
}
var _default = exports["default"] = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode,
  genData: genData
};