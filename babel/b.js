let twoLoader = function(source) {
    console.info('b-loader');
    return source + 'b-loader';
};

twoLoader.pitch = function(source) {
    console.info('b-loader的pitch');
}

module.exports = twoLoader

