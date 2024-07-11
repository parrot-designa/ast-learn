export function createCompilerCreator(baseCompile){
    return function createCompiler(baseOptions){

        function compile(){
            
        }
        return {
            compile,
            compileToFunctions: createCompileToFunctionFn(compile)
        }
    }
}