"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = html;
var _props = require("../parser/props");
function html(el, dir) {
  if (dir.value) {
    (0, _props.addProp)(el, 'innerHTML', "_s(".concat(dir.value, ")"));
  }
}