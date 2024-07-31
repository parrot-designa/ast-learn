"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genDirectives = genDirectives;
exports.genFor = genFor;
exports.genIf = genIf;
exports.genIfConditions = genIfConditions;
exports.genOnce = genOnce;
var _astElement = require("./ast-element");
function genDirectives(el, state) {
  var dirs = el.directives;
  if (!dirs) return;
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;

    /**
     * 内置的一些指令在生成data时不需要添加directive
     */
    var gen = state.directives[dir.name];
    if (gen) {
      needRuntime = !!gen(el, dir);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"".concat(dir.name, "\", rawName:\"").concat(dir.rawName, "\"").concat(dir.value ? ",value:(".concat(dir.value, "),expression:").concat(JSON.stringify(dir.value)) : '', "},");
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']';
  }
}
function genIf(el, state) {
  el.ifProcessed = true;
  return genIfConditions(el.ifConditions.slice(), state);
}
function genIfConditions(conditions, state) {
  if (!conditions.length) {
    /**
     * _e() 是一个用于生成空的虚拟 DOM 节点（vnode）的辅助函数。它的全名实际上是 createEmptyNode()。
     */
    return '_e()';
  }
  var condition = conditions.shift();
  /**
   * v-else 时 没有exp
   */
  if (condition.exp) {
    return "(".concat(condition.exp, ")?").concat(genTernaryExp(condition.block), ":").concat(genIfConditions(conditions, state));
  } else {
    return "".concat(genTernaryExp(condition.block));
  }
  function genTernaryExp(el) {
    return (0, _astElement.genElement)(el, state);
  }
}
function genFor(el, state) {
  var exp = el["for"];
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ",".concat(el.iterator1) : '';
  var iterator2 = el.iterator2 ? ",".concat(el.iterator2) : '';
  el.forProcessed = true;
  return "_l((".concat(exp, "),") + "function(".concat(alias).concat(iterator1).concat(iterator2, "){") + "return ".concat((0, _astElement.genElement)(el, state)) + '})';
}
function genOnce(el, state) {
  el.onceProcessed = true;
  if (el["if"] && !el.ifProcessed) {
    return genIf(el, state);
  } else {
    return genStatic(el, state);
  }
}
function genStatic(el, state) {
  el.staticProcessed = true;
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node. 
  state.staticRenderFns.push("with(this){return ".concat((0, _astElement.genElement)(el, state), "}"));
  return "_m(".concat(state.staticRenderFns.length - 1, ")");
}