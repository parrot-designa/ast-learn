let oneLoader = function(source) {
    console.info('a-loader');
    return source + 'a-loader';
};
oneLoader.pitch = function(){
    console.info('a-loader的pitch');
}
module.exports = oneLoader