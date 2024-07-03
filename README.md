Vue2编译原理


# 一、Vue项目开发模式

Vue除了runtime-only模式外，还有runtime-compiler模式。

## 1.1 Runtime-Only模式

平时我们开发项目基本都采用这种模式。在这种模式下，Vue在构建时将模板预先编译成渲染函数，因此最终的打包产物不包含模板编译器。这意味着在运行时，Vue实例需要接收一个已经预编译好的渲染函数，通常这个过程在使用如webpack + vue-loader时自动完成。由于不需要包含编译器，此模式生成的代码体积更小，加载更快。

所以在这个模式下流程大致是：webpack+vue-loader在代码构建阶段将.vue模版中的内容转化成一个render函数。

## 1.2 Runtime+Compiler模式

与Runtime-Only相比，runtime+compiler 模式包含了模板编译器，它允许Vue在运行时动态地编译模板。这意味着你可以在客户端即刻读取与编译模板字符串，这对于一些特定的应用场景（比如使用Vue来动态渲染用户输入的模板）非常有用。但这种方式会导致最终打包的文件体积更大，因为包含了编译器的代码。

所以在这个模式下流程大致是：不借助webpack，通过Vue内置编译器将template中的内容或者dom节点转化成render函数。

在Vue 2中，这两个模式的选择通常是通过如何引入Vue库以及构建配置来区分的。而在Vue 3中，默认推荐使用runtime-only模式，并且鼓励开发者使用.vue单文件组件，其中的模板会在构建时被预编译。如果需要在Vue 3中使用类似runtime+compiler的功能，可能需要额外配置或寻找替代方案，因为Vue 3的核心库默认不再包含完整的编译器。


# 二、Vue 的 Runtime+Compiler模式

我们先来研究一下Vue中的Runtime + Compiler模式，因为这个模式中包含了完整的编译相关的代码。

## 2.1 直接使用HTML来编写Vue项目

当你只想写一个简单的页面，不想使用脚手架来建一个比较庞大的项目时，你可以直接创建一个html文件。
只需要引入全量的Vue包，即包含了Runtime和Compiler的包。就可以进行开发，这一点还是比较方便的。

```js
<!DOCTYPE html>
<html>
    <head>
        <script src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"></script>
    </head>
    <body>
        <div id="container">
            Hello, {{ name }}
        </div>
        <script>
            new Vue({
                el:"#container",
                data(){
                    return {
                        name:"Vue2"
                    }
                }
            })
        </script>
    </body>
</html>
```

## 2.2 Vue Compiler编译的大致流程

1. 在内部获取到模版对应的字符串
2. 调用 compilerHTMLStringToAST 函数将

## 2.3 编译入口

Runtime代码打包入口位于```src/platforms/web/runtime/index.ts```中。

而Rutime+Compiler代码打包入口位于```src/platforms/web/entry-runtime-with-compiler-es.ts```中。

```js
import Vue from './runtime/index'
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    __DEV__ &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (__DEV__ && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (__DEV__) {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // @ts-expect-error
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: __DEV__,
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
} 
```

