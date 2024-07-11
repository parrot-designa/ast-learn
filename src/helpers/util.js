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