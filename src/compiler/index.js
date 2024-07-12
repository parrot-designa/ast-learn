import { parse } from "../parser/index";
import { generate } from "../codegen/generate";
import { baseOptions } from "./options";
function compileToFunctions(template){
    const options = baseOptions;
    /**
     * trim() 方法被用来移除字符串两端的空白字符。
     * 当解析模板字符串时，如果模板字符串的开头或结尾有空白字符，它们通常是无意义的，并且可能干扰解析过程或导致生成的 HTML 有额外的空白，
     * 这可能会影响到页面布局或元素间的间距。
     */
    const ast = parse(template.trim(),options); 
    const code = generate(ast,options); 
    debugger;
    return {
        render: new Function(`with(this){return ${code}}`)
    }
} 

export { compileToFunctions }