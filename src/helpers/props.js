
export function addProp(
    el,
    name,
    value,
    range,
    dynamic
) {
    (el.props || (el.props = [])).push(
      { name, value, dynamic }
    )
    el.plain = false
}