/**
 * 判断是否是自闭和
 */
export const isUnaryTag = (tagName) => [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'frame',
    'hr',
    'img',
    'input',
    'isindex',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
].indexOf(tagName) > -1;

/**
 * 
 * @param {*} cssText eg:"color:red; font-size:16px;"
 * @returns     eg:{ color: 'red', 'font-size': '16px' }
 */
export const parseStyleText = (cssText) => {
    const res = {}
    const listDelimiter = /;(?![^(]*\))/g
    const propertyDelimiter = /:(.+)/
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        const tmp = item.split(propertyDelimiter)
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
      }
    })
    return res
}

export function extend(
  to,
  _from
){
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}


export function findPrevElement(children){
  let i = children.length
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      children.pop()
    }
  }
}


export const emptyObject = Object.freeze({})