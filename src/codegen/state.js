import { pluckModuleFunction } from "../helpers"

export class CodegenState {
    dataGenFns
    directives
    staticRenderFns

    constructor(options){
        this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
        this.directives = options.directives;
        this.staticRenderFns = []
    }
}