let threeLoader = function(source) {
    console.info('c-loader');
    return source + 'c-loader';
};

threeLoader.pitch = function(source) {
    console.info('c-loader的pitch');
}

module.exports = threeLoader;