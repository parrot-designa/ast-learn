import { pluckModuleFunction } from "../helpers"

export class CodegenState {
    dataGenFns

    constructor(options){
        this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
        this.directives = options.directives;
    }
}