let eLoader = function(source) {
    console.info('e-loader');
    return source + 'e-loader';
};

eLoader.pitch = function(source) {
    console.info('e-loader的pitch');
}

module.exports = eLoader;