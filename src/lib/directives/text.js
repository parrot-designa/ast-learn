"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = text;
var _props = require("../parser/props");
function text(el, dir) {
  if (dir.value) {
    (0, _props.addProp)(el, 'textContent', "_s(".concat(dir.value, ")"));
  }
}