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