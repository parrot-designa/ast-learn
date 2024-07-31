"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genChildren = genChildren;
exports.genElement = genElement;
exports.genNode = genNode;
exports.genText = genText;
var _directive = require("./directive");
var _data = require("./data");
function genElement(el, state) {
  var code, tag, data;
  if (!tag) tag = "'".concat(el.tag, "'");

  /**
   * ifProcessed 这个属性的作用是用来标记一个元素是否已经被处理过 v-if 或类似条件渲染指令
   */
  if (el.once && !el.onceProcessed) {
    return (0, _directive.genOnce)(el, state);
  } else if (el["for"] && !el.forProcessed) {
    return (0, _directive.genFor)(el, state);
  } else if (el["if"] && !el.ifProcessed) {
    return (0, _directive.genIf)(el, state);
  }
  /**
   * plain 属性用于标识一个元素节点是否被认为是“纯”的，即是否没有绑定任何动态特性。这个属性的值会在模板编译过程的不同阶段被计算和更新，以决定元素的编译策略。
   * 
   * plain的判断逻辑是：1.没有key 2.没有作用域插槽 3.没有属性 如果没有这三个 表示不用进行data的处理
   */
  if (!el.plain) {
    data = (0, _data.genData)(el, state);
  }
  var children = genChildren(el, state, true);
  code = "_c(".concat(tag).concat(data ? ",".concat(data) : '').concat(children ? ",".concat(children) : '', ")");
  return code;
}
function genChildren(el, state, checkSkip) {
  var children = el.children;
  if (children.length) {
    var _el = children[0];
    /**
     * 适用于v-for
     */
    if (children.length === 1 && _el["for"]) {
      return genElement(_el, state);
    }
    var normalizationType = checkSkip ? getNormalizationType(children) : 0;
    return "[".concat(children.map(function (c) {
      return genNode(c, state);
    }).join(','), "]").concat(normalizationType ? ",".concat(normalizationType) : '');
  }
}
function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state);
  } else {
    return genText(node);
  }
}

/**
 *  基于传入的抽象语法树节点类型生成对应的 Vue.js 渲染函数中的文本部分
 * 
 * 1. text.type === 2 判断 text 参数是否是一个 ASTExpression 类型的节点（在 Vue.js 的 AST 中，type 2 通常代表表达式节点）
 * 2. 如果 text.type 等于 2，则返回 text.expression，这意味着在 _v() 函数中直接使用表达式的值。由于表达式已经被包裹在 _s() 函数中（假设 _s() 是一个安全转换函数），所以不需要额外的括号。
 * 3. 如果 text.type 不等于 2，则意味着这是一个文本节点（ASTText）。在这种情况下，函数会调用 transformSpecialNewlines 并传递给它一个经过 JSON.stringify 转换的 text.text。
 * 
 * JSON.stringify(text.text) 的使用是为了确保文本内容能够被安全地转换为字符串，并且在最终的渲染函数中以字符串的形式插入到模板中。
 * 如果你写了一个中文 eg:测试 在生成模版时，不会将其变成字符串。渲染时，会将其视为一个变量，进而报错
 */
function genText(text) {
  return "_v(".concat(text.type === 2 ? text.expression : transformSpecialNewlines(JSON.stringify(text.text)), ")");
}
function transformSpecialNewlines(text) {
  /**
   * 将 \u2028（行分隔符）和 \u2029（段落分隔符）转换为 \\u2028 和 \\u2029 主要是出于字符串字面量和代码生成的考虑，特别是在 JavaScript 中。
   * 
   * 在 JavaScript 字符串字面量中，\u 是一个转义序列的开始，用来表示 Unicode 字符。
   * 
   * 当你在字符串中直接写 \u2028 或 \u2029，JavaScript 解释器会将其识别为一个 Unicode 字符，并将其转换为实际的行分隔符或段落分隔符字符。
   * 
   * 然而，在某些情况下，比如当你在生成字符串或代码片段时，你可能希望这些 Unicode 字符作为文本的一部分，而不是被解释为实际的字符。
   * 
   * 例如，当你生成一个要被其他代码解析的字符串，或者当你正在构建一个需要精确格式的字符串（比如 JSON 或某些配置文件）时，你可能需要这些 Unicode 转义序列保持原样，而不是被解释。
   * 
   * 在这种情况下，你需要双重转义，即使用 \\u2028 和 \\u2029，来确保它们在最终的字符串中被表示为字面量 \u2028 和 \u2029，而不是被解释为特殊字符。
   * 
   * 这样做的结果是，当你的字符串被其他代码解析时，解析器可以正确地识别出 \u2028 和 \u2029 作为需要进一步处理的转义序列，而不是作为普通文本中的特殊字符。
   */
  return text.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

/**
 * 确定给定的 children 节点数组需要哪种类型的规范化
 * 0: 不需要规范化
 * 1: 需要简单的规范化，可能涉及一层深度的嵌套数组。
 * 2: 需要完全的规范化
 *  
 */
function getNormalizationType(children) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue;
    }
    if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return needsNormalization(c.block);
    })) {
      res = 2;
      break;
    }
  }
  return res;
}
function needsNormalization(el) {
  return el["for"] !== undefined;
}