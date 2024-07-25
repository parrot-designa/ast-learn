const id = 'vue-loader-plugin'
const BasicEffectRulePlugin = require('webpack/lib/rules/BasicEffectRulePlugin')
const BasicMatcherRulePlugin = require('webpack/lib/rules/BasicMatcherRulePlugin')
const RuleSetCompiler = require('webpack/lib/rules/RuleSetCompiler')
// 解析和应用use字段 UseEffectRulePlugin 会处理 loader 属性，并构建一个 use 类型的效果描述。
const UseEffectRulePlugin = require('webpack/lib/rules/UseEffectRulePlugin')

const objectMatcherRulePlugins = []
try {
  const ObjectMatcherRulePlugin = require('webpack/lib/rules/ObjectMatcherRulePlugin')
  objectMatcherRulePlugins.push(
    new ObjectMatcherRulePlugin('assert', 'assertions'),
    new ObjectMatcherRulePlugin('descriptionData')
  )
} catch (e) {
  const DescriptionDataMatcherRulePlugin = require('webpack/lib/rules/DescriptionDataMatcherRulePlugin')
  objectMatcherRulePlugins.push(new DescriptionDataMatcherRulePlugin())
}

const ruleSetCompiler = new RuleSetCompiler([
    new BasicMatcherRulePlugin('test', 'resource'),
    new BasicMatcherRulePlugin('mimetype'),
    new BasicMatcherRulePlugin('dependency'),
    new BasicMatcherRulePlugin('include', 'resource'),
    new BasicMatcherRulePlugin('exclude', 'resource', true),
    new BasicMatcherRulePlugin('conditions'),
    new BasicMatcherRulePlugin('resource'),
    new BasicMatcherRulePlugin('resourceQuery'),
    new BasicMatcherRulePlugin('resourceFragment'),
    new BasicMatcherRulePlugin('realResource'),
    new BasicMatcherRulePlugin('issuer'),
    new BasicMatcherRulePlugin('compiler'),
    ...objectMatcherRulePlugins,
    new BasicEffectRulePlugin('type'),
    new BasicEffectRulePlugin('sideEffects'),
    new BasicEffectRulePlugin('parser'),
    new BasicEffectRulePlugin('resolve'),
    new BasicEffectRulePlugin('generator'),
    new UseEffectRulePlugin()
]) 
  
class VuePlugin {
    apply(compiler){
        /**
         * 允许插件在Webpack编译过程中针对普通模块进行干预
         */
        const normalModule = compiler.webpack
            ? compiler.webpack.NormalModule
            : require('webpack/lib/NormalModule')
        console.log("vue-plugin执行") 
        // compiler options是webpack配置的引用 获取配置的rules
        const rules = compiler.options.module.rules
        let rawVueRule
        let vueRules = [];

        for (const rawRule of rules) {
            // skip rules with 'enforce'. eg. rule for eslint-loader
            /**
             * 在Webpack配置中，enforce 属性被用来标记那些应该在其他规则之前或之后执行的Loader。
             * enforce 可以设置为 "pre" 或 "post"，这分别表示Loader应该在其他Loader之前或之后执行。
             * 当enforce 设置为 "pre" 时，这意味着该Loader将作为预处理器执行，通常用于代码质量检查，如linting（语法检查）。
             * 例如，eslint-loader 就经常被设置为 "pre"，以便在实际编译之前检查代码的语法错误和风格问题。
             * 当enfore 设置为 "post" 时，这意味着该Loader将在所有其他Loader执行完之后执行，这通常用于一些后期处理的任务，比如压缩或代码修改。
             * 1. 避免干扰: 那些带有 enforce 的规则通常是为了执行一些特定的预处理或后处理任务，它们的执行顺序对于这些任务的成功至关重要。因此，直接在这些规则上应用额外的逻辑可能会破坏原有的流程，比如破坏linting或压缩的正确性。
             * 2. 性能考虑: 预处理器如linter可能会对每个文件执行复杂的检查，这可能会很耗时。在某些情况下，可能不希望在遍历或修改规则的过程中影响到这些预处理器的执行。
             * 3. 保持预期行为: 跳过 enforce 规则有助于确保Webpack配置按照开发者的意图执行，即预处理器和后处理器按原样工作，不受其他插件或规则修改的影响。
             */
            if (rawRule.enforce) {
                continue
            }
            // 匹配处理.vue格式的规则
            vueRules = match(rawRule, 'foo.vue')
            // 如果匹配不到.vue格式 匹配.vue.html
            if (!vueRules.length) {
                vueRules = match(rawRule, 'foo.vue.html')
            }
            if (vueRules.length > 0) {
                if (rawRule.oneOf) {
                  throw new Error(
                    `当前loader版本不支持oneOf`
                  )
                }
                rawVueRule = rawRule
                // 匹配到就跳出循环
                break
            }
        }

        if (!vueRules.length) {
            throw new Error(
                `没有找到匹配.vue文件的规则`
            )
        }
        /**
         * vueRules 数组中提取出所有类型为 'use' 的规则，并返回一个由这些规则的 value 属性组成的数组
         */
        const vueUse = vueRules
            .filter((rule) => rule.type === 'use')
            .map((rule) => rule.value)

        const vueLoaderUseIndex = vueUse.findIndex((u) => {
          /**
           * 1. 直接匹配 vue-loader：
           *    如果字符串以 vue-loader 开始，则匹配成功。
           * 2. 匹配路径中的 vue-loader：
           *    如果字符串中包含路径分隔符（/、\ 或 @）后面跟着 vue-loader，则匹配成功
           */
          return /^vue-loader|(\/|\\|@)vue-loader/.test(u.loader)
        })

        if(vueLoaderUseIndex < 0){
          throw new Error(
            `请确保你的.vue规则中配置了vue-loader`
          )
        }
        const vueLoaderUse = vueUse[vueLoaderUseIndex]
        vueLoaderUse.ident = 'vue-loader-options'
        vueLoaderUse.options = vueLoaderUse.options || {}

        // 是否配置了某种内联匹配资源功能
        const enableInlineMatchResource =
          vueLoaderUse.options.experimentalInlineMatchResource

        const pitcher = {
          loader: require.resolve('../loaders/pitcher'),
          resourceQuery: (query) => {
            if (!query) {
              return false
            }
            // const parsed = qs.parse(query.slice(1))
            // return parsed.vue != null
          },
          options: vueLoaderUse.options
        }
        compiler.options.module.rules = [
          pitcher,
          ...rules
        ]; 
    }
}

const matcherCache = new WeakMap()

function match(rule, fakeFile) {
    let ruleSet = matcherCache.get(rule)
    if (!ruleSet) {
      // skip the `include` check when locating the vue rule
      const clonedRawRule = { ...rule }
      delete clonedRawRule.include
  
      ruleSet = ruleSetCompiler.compile([clonedRawRule])
      matcherCache.set(rule, ruleSet)
    }
  
    return ruleSet.exec({
      resource: fakeFile
    })
}

module.exports = VuePlugin;