let cached
/**
 * 
 * @param {*} ctx webpack工作根目录
 * @param {*} loaderContext loader上下文
 * @returns 
 */
exports.resolveCompiler = function(ctx, loaderContext){
    if (cached) {
        return cached
    }

    try{
        // 查找vue的pkg内容
        const pkg = loadFromContext('vue/package.json', ctx)
        // major-主版本 minor-次版本
        const [major, minor] = pkg.version.split('.')
        /**
         * 在 Vue.js 2.7 版本中，对单文件组件（Single File Components, SFCs）的编译器进行了一些改进。
         * 具体来说，Vue.js 2.7 引入了一个新的独立的编译器包 vue/compiler-sfc，它提供了更细粒度的控制和更好的性能。
         */
        if (major === '2' && Number(minor) >= 7) {
            return (cached = {
                is27:true,
                compiler: loadFromContext('./vue-loader/compiler-sfc/index', ctx),
                // compiler: loadFromContext('@vue/compiler-sfc', ctx),
                templateCompiler: undefined
            })
        }
    }catch(e){
      debugger;
    }

    return (cached = {
        compiler: require('@vue/component-compiler-utils'),
        templateCompiler: loadTemplateCompiler(ctx, loaderContext)
    })
}

function loadFromContext(path, ctx) {
    // 用来解析模块路径的。它返回给定模块路径的绝对路径
    return require(require.resolve(path, {
      //paths 选项被用来指定一个额外的目录列表，Node.js 将在这个列表中查找模块。
      paths: [ctx]
    }))
}

// 用来加载vue-template-compiler
function loadTemplateCompiler(ctx, loaderContext) {
    try {
      return loadFromContext('vue-template-compiler', ctx)
    } catch (e) {
      if (loaderContext) {
        if (/version mismatch/.test(e.toString())) {
          loaderContext.emitError(e)
        } else {
          loaderContext.emitError(
            new Error(
              `[vue-loader] vue-template-compiler must be installed as a peer dependency, ` +
                `or a compatible compiler implementation must be passed via options.`
            )
          )
        }
      } else {
        throw e
      }
    }
  }