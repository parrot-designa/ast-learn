"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseText = parseText;
var _filterParse = require("./filter-parse");
/**
 * 用于匹配Vue.js模板中的双大括号表达式，也就是所谓的插值表达式
 */
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function parseText(text) {
  var tagRE = defaultTagRE;
  if (!tagRE.test(text)) {
    return;
  }
  var tokens = [];
  var rawTokens = [];
  /**
   * tagRE.lastIndex = 0这行代码的作用是重置正则表达式对象tagRE的lastIndex属性为0。
   * 在JavaScript中，正则表达式的lastIndex属性用于记录上一次匹配操作结束的位置，这对于全局搜索（即使用g标志的正则表达式）尤其重要。
   * 
   * 当你在一个字符串中使用正则表达式的exec方法进行多次匹配时，lastIndex会自动更新，记录下一次搜索的起始位置。
   * 这样做的目的是使得连续调用exec可以从上次匹配结束的地方开始继续搜索，避免重复搜索已经检查过的部分。
   * 
   * 然而，如果在不同地方重复使用同一个正则表达式对象，并且这个正则表达式包含g标志（全局搜索），那么lastIndex的值可能会导致意外的行为。
   * 例如，如果lastIndex没有被重置，那么在新的搜索开始时，exec方法可能不会从字符串的开头开始搜索，而是从上一次搜索结束的位置开始，这可能导致错过某些匹配。
   * 
   * 因此，在进行新的搜索之前，将lastIndex设置回0可以确保搜索总是从字符串的开始位置进行，无论之前发生了什么。在你的代码中，tagRE.lastIndex = 0确保每次调用parseText函数时，tagRE.exec都会从text字符串的起始位置开始搜索匹配的双大括号表达式，从而避免潜在的遗漏或重复搜索的问题。
   */
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while (match = tagRE.exec(text)) {
    index = match.index;
    // 文字token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    var exp = (0, _filterParse.parseFilters)(match[1].trim());
    tokens.push("_s(".concat(exp, ")"));
    rawTokens.push({
      '@binding': exp
    });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  };
}