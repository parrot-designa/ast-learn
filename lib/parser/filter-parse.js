"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFilters = parseFilters;
var validDivisionCharRE = /[\w).+\-_$\]]/;

/**
 * 其主要功能是从给定的表达式字符串中分离出过滤器，并对它们进行适当的处理
 */
function parseFilters(exp) {
  // 是否在单引号中
  var inSingle = false;
  // 是否在双引号中
  var inDouble = false;
  // 是否在模版字符串内
  var inTemplateString = false;
  // 是否在正则表达式内部
  var inRegex = false;
  // 出现园括号的次数
  var paren = 0;
  // 出现方括号的次数
  var square = 0;
  // 出现大括号的次数
  var curly = 0;
  // 上一个过滤器结束的位置
  var lastFilterIndex = 0;
  var c, i, prev,
    // 基本表达式
    expression,
    // 找到的过滤器
    filters;
  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      /**
       * 在编程语言中，单引号 ' 常用来界定字符串的开始和结束。但是，如果字符串本身需要包含单引号，那么通常会使用反斜杠 \ 来转义单引号，即\'。
       * 因此，当解析器遇到一个单引号 ' 并且前一个字符不是反斜杠 \，就可以断定这不是一个转义字符，而是字符串的结束标志。
       * 所有满足这个条件 可以判断不在单引号内
       */
      if (c === 0x27 && prev !== 0x5c) inSingle = false;
    } else if (inDouble) {
      /**
       * 同理（inSingle）可以判断不在双引号内
       */
      if (c === 0x22 && prev !== 0x5c) inDouble = false;
    } else if (inTemplateString) {
      /**
       * 同理（inSingle）可以判断不在模版字符串内
       */
      if (c === 0x60 && prev !== 0x5c) inTemplateString = false;
    } else if (inRegex) {
      /**
       * 同理（inSingle）可以判断不在正则内
       */
      if (c === 0x2f && prev !== 0x5c) inRegex = false;
    } else if (
    //检查当前字符是否是管道符：
    c === 0x7c &&
    // pipe |
    //确保当前的管道符不是连续的两个或更多管道符的一部分。在Vue的模板语法中，过滤器的分隔符不会连续出现。
    exp.charCodeAt(i + 1) !== 0x7c && exp.charCodeAt(i - 1) !== 0x7c &&
    //!curly、!square 和 !paren 确认当前不在任何括号结构中。这是因为括号内的表达式可能包含逻辑操作符 |，我们不希望误将其识别为过滤器的分隔符。
    !curly && !square && !paren) {
      if (expression === undefined) {
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        // 0x27 对应的字符为 ' 
        case 0x27:
          inSingle = true;
          break;
        // '
        // 0x22 对应的字符为 "
        case 0x22:
          inDouble = true;
          break;
        // "
        case 0x60:
          inTemplateString = true;
          break;
        // `
        case 0x28:
          paren++;
          break;
        // (
        case 0x29:
          paren--;
          break;
        // )  
        case 0x5b:
          square++;
          break;
        // [
        case 0x5b:
          square++;
          break;
        // [
        case 0x7b:
          curly++;
          break;
        // {   
        case 0x7d:
          curly--;
          break;
        // }
      }
      // /
      if (c === 0x27) {
        var j = i - 1;
        var p = void 0;
        for (; j >= 0; j--) {
          p = exp.charAt(i);
          if (p !== ' ') break;
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }
  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }
  function pushFilter() {
    ;
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }
  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }
  return expression;
}

/**
 * 其主要任务是将过滤器及其参数转化为可以被正确执行的 JavaScript 代码
 */
function wrapFilter(exp, filter) {
  /**
   * 检测是否有参数
   * 首先，函数检查过滤器字符串中是否包含左括号 (，这是过滤器参数的开始标记。
   *      如果 indexOf('(') 返回小于 0 的值，意味着过滤器没有参数。
   */
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return "_f(\"".concat(filter, "\")(").concat(exp, ")");
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return "_f(\"".concat(name, "\")(").concat(exp).concat(args !== ')' ? ',' + args : args);
  }
}