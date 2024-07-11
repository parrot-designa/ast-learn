import { parse } from "../parser/index";
import { generate } from "../codegen/generate";
import { baseOptions } from "./options";
function compileToFunctions(template){
    const options = baseOptions;
    const ast = parse(template,options); 
    const code = generate(ast,options);
    debugger;
    return {
        render: new Function(code)
    }
} 

export { compileToFunctions }