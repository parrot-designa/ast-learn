const VueLoaderPlugin = require('./plugin/index');
const hash = require('hash-sum')
const path = require('path');
const { resolveCompiler } = require('./compiler')
const loaderUtils = require('loader-utils')
/**
 * source参数通常指的是源代码字符串，即需要通过这个加载器处理的模块的原始内容
 * 当Webpack解析模块并遇到一个加载器时，它会将该模块的源代码以字符串的形式传递给这个加载器
 */
function loader(source){
    const loaderContext = this;
    const {
        // 它指向Webpack构建过程的根目录
        rootContext,
        // 可以获取到处理文件的路径
        resourcePath,
        // 是否配置了sourceMap
        sourceMap,
        mode
    } = loaderContext;
    console.log("处理loader==>",resourcePath)
    //stringifyRequest 生成一个可以被直接插入到 JavaScript 代码中的模块请求字符串。
    const stringifyRequest = (r) => loaderUtils.stringifyRequest(loaderContext, r)
    // 是否是生产模式
    const isProduction =
        mode === 'production' ||
        process.env.NODE_ENV === 'production'
    // 返回当前工作目录的绝对路径。在Webpack加载器的上下文中，process.cwd() 表示的是Node.js进程启动时所在的目录，通常也就是项目脚本运行时所在的目录
    const context = rootContext || process.cwd()
    // 获取文件名
    const filename = path.basename(resourcePath)
    /**
     * 生成一个简化的文件路径 用于标识Vue SFC文件
     */
    // module id for scoped CSS & hot-reload
    const rawShortFilePath = path
        .relative(context, resourcePath)
        .replace(/^(\.\.[\/\\])+/, '')
    const shortFilePath = rawShortFilePath.replace(/\\/g, '/')
    const id = hash(
        isProduction
          ? shortFilePath + '\n' + source.replace(/\r\n/g, '\n')
          : shortFilePath
    ) 
    const { compiler, templateCompiler } = resolveCompiler(context, loaderContext);
     
    // 解析源代码 并生成一些解析后的数据
    const descriptor = compiler.parse({
        source,
        filename,
        compiler:templateCompiler,
        needMap: sourceMap
    })

    // 模板
    let templateImport = `var render, staticRenderFns`
    let templateRequest
    if (descriptor.template) {
        const src = descriptor.template.src || resourcePath
        const externalQuery = descriptor.template.src ? `&external` : ``
        const idQuery = `&id=${id}`
        const query = `?vue&type=template${idQuery}`

        templateRequest = stringifyRequest(src + query)

        templateImport = `import { render, staticRenderFns } from ${templateRequest}`
    }

    let code = `
    ${templateImport}
    `;
    if(this.resourcePath === '/Users/wjb/Desktop/life/learn/front-end/framework/vue/learn-vue2-ast/src/App.vue'){
        return `
            import App from "./child-view/A.vue";
            import App2 from "./child-view/B.vue";

            export default {}
        `;
    }else if(this.resourcePath === '/Users/wjb/Desktop/life/learn/front-end/framework/vue/learn-vue2-ast/src/child-view/A.vue'){
        return 'import App from "./A-child.vue"';
    }else if(this.resourcePath === '/Users/wjb/Desktop/life/learn/front-end/framework/vue/learn-vue2-ast/src/child-view/B.vue'){
        return 'import App from "./B-child.vue"';
    }else {
        return "other"
    }
    
}


module.exports = loader

module.exports.VueLoaderPlugin = VueLoaderPlugin