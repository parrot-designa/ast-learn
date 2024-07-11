import { CodegenState } from "../codegen";

export function generate(
    ast,
    options
){
    const state = new CodegenState(options);
    const code = ast ? genElement(ast,state) : '_c("div")'
    /**
    * with(this) 语句的使用主要是为了确保组件实例的作用域内的属性和方法可以在生成的代码中直接访问，
    * 当Vue编译模版时，它会生成一个渲染函数，这个函数需要能访问到组件实例上的数据、计算属性、方法等。
    * 
    * 使用 with(this) 语句可以创建一个作用域，其中所有的变量引用都会从当前组件实例 (this) 上查找。
    * 这允许你直接在渲染函数中使用像 someData 这样的变量，而不需要显式地写成 this.someData。
    */ 
    return `with(this){return ${code}}`;
}

export function genElement(el,state){
    let code,tag,data;
    if(!tag) tag =`'${el.tag}'`

    /**
     * plain 属性用于标识一个元素节点是否被认为是“纯”的，即是否没有绑定任何动态特性。这个属性的值会在模板编译过程的不同阶段被计算和更新，以决定元素的编译策略。
     * 
     * plain的判断逻辑是：1.没有key 2.没有作用域插槽 3.没有属性 如果没有这三个 表示不用进行data的处理
     */
    if(!el.plain){
        data = genData(el,state);
    }

    const children = genChildren(el);
    code =`_c(${tag}${
        data ? `,${data}`:''
    }${
        children ? `,${children}`:''
    })`
    return code;
}

export function genChildren(
    el
){
    const children = el.children;
    if(children.length){
        const el = children[0];

        return `[${children.map(c => genNode(c)).join(',')}]`
    }
}


function genNode(node){
    return genText(node);
}

/**
 *  基于传入的抽象语法树节点类型生成对应的 Vue.js 渲染函数中的文本部分
 * 
 * 1. text.type === 2 判断 text 参数是否是一个 ASTExpression 类型的节点（在 Vue.js 的 AST 中，type 2 通常代表表达式节点）
 * 2. 如果 text.type 等于 2，则返回 text.expression，这意味着在 _v() 函数中直接使用表达式的值。由于表达式已经被包裹在 _s() 函数中（假设 _s() 是一个安全转换函数），所以不需要额外的括号。
 * 3. 如果 text.type 不等于 2，则意味着这是一个文本节点（ASTText）。在这种情况下，函数会调用 transformSpecialNewlines 并传递给它一个经过 JSON.stringify 转换的 text.text。
 */
export function genText(text){
    return `_v(${
        text.type === 2 
            ? text.expression
            : transformSpecialNewlines(text.text)
    })`
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
    return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}

export function genData(el,state){
    let data = '{'
    /**
     * 在给定的 genData 函数中，通过循环调用 state.dataGenFns 数组中的每一个函数，这些函数每个都会返回一个字符串，这个字符串可能代表了一部分数据定义。
     * 这些部分被拼接起来形成一个更大的数据定义字符串。然而，在循环的过程中，每个返回的字符串后可能会自动添加逗号（,）以便于在拼接时方便地分隔每个部分。
     * 
     * {
     *   "key1": "value1",
     *   "key2": "value2",
     *   "key3": "value3",
    *  }
     */
    for (let i = 0; i < state.dataGenFns.length; i++) {
        data += state.dataGenFns[i](el)
    }
    data = data.replace(/,$/, '') + '}'
    return data
}