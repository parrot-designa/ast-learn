const vBindRE = /v-bind\s*\(/g

const  LexerState = {
    inParens:1,
    inSingleQuoteString:2,
    inDoubleQuoteString:3
}

function normalizeExpression(exp) {
    exp = exp.trim()
    if (
      (exp[0] === `'` && exp[exp.length - 1] === `'`) ||
      (exp[0] === `"` && exp[exp.length - 1] === `"`)
    ) {
      return exp.slice(1, -1)
    }
    return exp
}
  
module.exports.parseCssVars = function parseCssVars(sfc){
    const vars = []
    sfc.styles.forEach(style => {
        let match
        const content = style.content.replace(/\/\*([\s\S]*?)\*\//g, '')
        while ((match = vBindRE.exec(content))) {
            const start = match.index + match[0].length
            const end = lexBinding(content, start)
            if (end !== null) {
                const variable = normalizeExpression(content.slice(start, end))
                if (!vars.includes(variable)) {
                  vars.push(variable)
                }
            }
        }
    })
}

function lexBinding(content, start) {
    let state = LexerState.inParens
    let parenDepth = 0
  
    for (let i = start; i < content.length; i++) {
      const char = content.charAt(i)
      switch (state) {
        case LexerState.inParens:
          if (char === `'`) {
            state = LexerState.inSingleQuoteString
          } else if (char === `"`) {
            state = LexerState.inDoubleQuoteString
          } else if (char === `(`) {
            parenDepth++
          } else if (char === `)`) {
            if (parenDepth > 0) {
              parenDepth--
            } else {
              return i
            }
          }
          break
        case LexerState.inSingleQuoteString:
          if (char === `'`) {
            state = LexerState.inParens
          }
          break
        case LexerState.inDoubleQuoteString:
          if (char === `"`) {
            state = LexerState.inParens
          }
          break
      }
    }
    return null
  }