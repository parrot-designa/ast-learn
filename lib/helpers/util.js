"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emptyObject = void 0;
exports.extend = extend;
exports.findPrevElement = findPrevElement;
exports.parseStyleText = exports.isUnaryTag = void 0;
/**
 * 判断是否是自闭和
 */
var isUnaryTag = exports.isUnaryTag = function isUnaryTag(tagName) {
  return ['area', 'base', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'].indexOf(tagName) > -1;
};

/**
 * 
 * @param {*} cssText eg:"color:red; font-size:16px;"
 * @returns     eg:{ color: 'red', 'font-size': '16px' }
 */
var parseStyleText = exports.parseStyleText = function parseStyleText(cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
};
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}
function findPrevElement(children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i];
    } else {
      children.pop();
    }
  }
}
var emptyObject = exports.emptyObject = Object.freeze({});