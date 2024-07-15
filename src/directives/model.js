export default function model(
    el,
    dir
){
    const tag = el.tag;
    const value = dir.value;

    if(tag === 'input' || tag === 'textarea'){
        genDefaultModel(el, value)
    }
}

function genDefaultModel(
    el,
    value
){
    const event = 'input';

    let valueExpression = '$event.target.value'
}

export function genAssignmentCode(value, assignment){
    
}