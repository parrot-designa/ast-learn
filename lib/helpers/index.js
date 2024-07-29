"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  pluckModuleFunction: true,
  getAndRemoveAttr: true,
  getBindingAttr: true
};
exports.getAndRemoveAttr = getAndRemoveAttr;
exports.getBindingAttr = getBindingAttr;
exports.pluckModuleFunction = pluckModuleFunction;
var _filterParse = require("../parser/filter-parse");
var _attrs = require("./attrs");
Object.keys(_attrs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _attrs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _attrs[key];
    }
  });
});
var _reg = require("./reg");
Object.keys(_reg).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _reg[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reg[key];
    }
  });
});
var _util = require("./util");
Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _util[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});
var _props = require("../parser/props");
Object.keys(_props).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _props[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _props[key];
    }
  });
});
/**
 *  从一组模块中提取特定的方法或属性，并返回一个只包含非空值的数组
 */
function pluckModuleFunction(modules, key) {
  return modules ? modules.map(function (m) {
    return m[key];
  }).filter(function (_) {
    return _;
  }) : [];
}

/**
 *  主要功能是获取并移除一个给定元素的某个属性。
 *  这个函数通常在处理 HTML 元素的属性，尤其是在解析或编译模板时使用，例如在 Vue.js 中处理元素上的绑定或指令。
 */
function getAndRemoveAttr(el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break;
      }
    }
  }
  return val;
}

/**
 *  从一个元素 (el) 上获取特定绑定属性的值 getStatic 可以获取非bind的值
 */
function getBindingAttr(el, name,
// 获取普通的值
getStatic) {
  var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return (0, _filterParse.parseFilters)(dynamicValue);
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue);
    }
  }
}