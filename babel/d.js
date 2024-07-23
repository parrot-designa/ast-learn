let dLoader = function(source) {
    console.info('d-loader');
    return source + 'd-loader';
};

dLoader.pitch = function(source) {
    console.info('d-loader的pitch');
}

module.exports = dLoader;