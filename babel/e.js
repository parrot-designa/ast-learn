let eLoader = function(source) {
    console.info('e-loader');
    return source + 'd-loader';
};

eLoader.pitch = function(source) {
    console.info('d-loader的pitch');
}

module.exports = eLoader;