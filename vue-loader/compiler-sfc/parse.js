const { DEFAULT_FILENAME,parseComponent } = require('./parseComponent');
const { parseCssVars } = require('./cssVars');

// 可以生成唯一确定hash值
const hash = require('hash-sum');
/**
 * lru-cache 是一个 Node.js 中常用的缓存模块，它实现了 LRU (Least Recently Used, 最近最少使用) 算法。这种算法用于管理缓存空间有限的情况，当缓存满了之后，会自动移除最近最少使用的项来腾出空间。
 *  */ 
const LRU = require('lru-cache');

const cache = new LRU(100)

module.exports.parse = function parse(options){
    const {
        // 源文件代码
        source,
        // 源文件名
        filename = DEFAULT_FILENAME,
        // pad 可能是指是否在解析后的抽象语法树 (AST) 中包含额外的信息，例如源代码的位置信息
        compilerParseOptions = { pad:false },
        compiler,
        needMap = true,
        sourceMap = needMap
    }=options;
    const cacheKey = hash(
        filename + source + JSON.stringify(compilerParseOptions)
    );
    let output = cache.get(cacheKey)
    if(output){
        // 直接取缓存
        return output;
    }
    if (compiler) {
        // 如果有 则使用提供的编译器 但是2.7以上版本是没有提供
    }else{
        output = parseComponent(source, compilerParseOptions)
    }
    output.filename = filename

    /**
     * 这段代码定义了一个名为 parseCssVars 的函数，用于从 Vue SFC (Single File Component) 的 <style> 标签中提取 CSS 变量（也称为 CSS 自定义属性）。这些变量通常以 var(--variable-name) 的形式出现在 CSS 中，并且可以通过 JavaScript 动态更改。
     */
    output.cssVars = parseCssVars(output)
    cache.set(cacheKey, output)
    
    return output
}