export function genProps(props){
    let staticProps = ``;
    let dynamicProps = ``;

    for(let i = 0;i < props.length ;i++){
        const prop = props[i];
        const value = prop.value;
        if (prop.dynamic) {
            dynamicProps += `${prop.name},${value},`
        }else{
            staticProps += `"${prop.name}":${prop.value},`;
        }
    }
    staticProps = `{${staticProps.slice(0, -1)}}`
    if (dynamicProps) {
        return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
    }else{
        return staticProps;
    }
    
}