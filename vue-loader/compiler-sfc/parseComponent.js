 

const { parseHTML } = require('../../lib/parser/html-parser');
const deindent = require('de-indent')

const isSpecialTag = (tag)=>['script','template','style'].includes(tag);

const DEFAULT_FILENAME = 'anonymous.vue';
function parseComponent(
    source,
    options
){
    const sfc = {
        source,
        filename: DEFAULT_FILENAME,
        template: null,
        script: null,
        scriptSetup: null,
        styles: [],
        customBlocks: [],
        cssVars: [],
        errors: [],
        shouldForceReload: null
    }
    let depth = 0
    let currentBlock = null

    let warn = msg => {
        sfc.errors.push(msg)
    } 
    function start(
        tag,
        attrs,
        unary,
        start,
        end
    ){
        if (depth === 0) {
            currentBlock = {
                type: tag,
                content: '',
                start: end,
                end: 0,
                attrs: attrs.reduce((cumulated, { name, value }) => {
                    cumulated[name] = value || true
                    return cumulated
                }, {})
            }

            // 设置src
            if (typeof currentBlock.attrs.src === 'string') {
                currentBlock.src = currentBlock.attrs.src
            }

            if (isSpecialTag(tag)) {
                checkAttrs(currentBlock, attrs)

                if (tag === 'script') {
                    const block = currentBlock
                    if (block.attrs.setup) {
                        block.setup = currentBlock.attrs.setup
                        sfc.scriptSetup = block
                    } else {
                        sfc.script = block
                    }
                } else if(tag === 'style'){
                    sfc.styles.push(currentBlock)
                } else {
                    sfc[tag] = currentBlock
                }
            }else{
                sfc.customBlocks.push(currentBlock)
            }
        }
        if (!unary) {
            depth++
        }
    }

    function end(tag, start){
        if (depth === 1 && currentBlock) {
            currentBlock.end = start
            let text = source.slice(currentBlock.start, currentBlock.end)
            // 是否对代码进行去锁进处理
            if (
                options.deindent === true ||
                // by default, deindent unless it's script with default lang or (j/t)sx?
                (options.deindent !== false &&
                  !(
                    currentBlock.type === 'script' &&
                    (!currentBlock.lang || /^(j|t)sx?$/.test(currentBlock.lang))
                  ))
            ) {
                // 去除多余的缩进
                text = deindent(text)
            }
            currentBlock.content = text
            currentBlock = null
        }
        depth--
    }

    function checkAttrs(block, attrs) {
        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i]
          if (attr.name === 'lang') {
            // 使用css预处理器
            block.lang = attr.value
          }
          if (attr.name === 'scoped') {
            // 样式仅应用于当前组件
            block.scoped = true
          }
          if (attr.name === 'module') {
            // 通常用于 CSS Modules。
            block.module = attr.value || true
          }
        }
    }

    parseHTML(source,{
        start,
        end
    })
    return sfc
}

module.exports.DEFAULT_FILENAME = DEFAULT_FILENAME;
module.exports.parseComponent = parseComponent;