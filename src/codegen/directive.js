export function genDirectives(
    el,
    state
){
    const dirs = el.directives
    if(!dirs) return;
    let res = 'directives:['
    let hasRuntime = false;
    let i,l,dir,needRuntime ;
    for(i = 0,l = dirs.length; i < l; i++){
        dir = dirs[i]
        needRuntime = true;

        if(needRuntime){
            hasRuntime = true
            res += `{name:"${dir.name}", rawName:"${dir.rawName}}"${
                dir.value
                    ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}`
                    : ''
            }},`
        }
    }
    if (hasRuntime) {
        return res.slice(0, -1) + ']'
    }
}