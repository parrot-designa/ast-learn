"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileToFunctions = compileToFunctions;
var _index = require("../parser/index");
var _generate2 = require("../codegen/generate");
var _options = require("./options");
function compileToFunctions(template) {
  var options = _options.baseOptions;
  /**
   * trim() 方法被用来移除字符串两端的空白字符。
   * 当解析模板字符串时，如果模板字符串的开头或结尾有空白字符，它们通常是无意义的，并且可能干扰解析过程或导致生成的 HTML 有额外的空白，
   * 这可能会影响到页面布局或元素间的间距。
   */
  var ast = (0, _index.parse)(template.trim(), options);
  var _generate = (0, _generate2.generate)(ast, options),
    code = _generate.code,
    state = _generate.state;
  debugger;
  return {
    render: new Function("with(this){return ".concat(code, "}")),
    staticRenderFns: state.staticRenderFns.map(function (item) {
      return new Function(item);
    })
  };
}