"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = generate;
var _state = require("../codegen/state");
var _astElement = require("./ast-element");
function generate(ast, options) {
  var state = new _state.CodegenState(options);
  var code = ast ? (0, _astElement.genElement)(ast, state) : '_c("div")';
  /**
  * with(this) 语句的使用主要是为了确保组件实例的作用域内的属性和方法可以在生成的代码中直接访问，
  * 当Vue编译模版时，它会生成一个渲染函数，这个函数需要能访问到组件实例上的数据、计算属性、方法等。
  * 
  * 使用 with(this) 语句可以创建一个作用域，其中所有的变量引用都会从当前组件实例 (this) 上查找。
  * 这允许你直接在渲染函数中使用像 someData 这样的变量，而不需要显式地写成 this.someData。
  */
  return {
    code: code,
    state: state
  };
}