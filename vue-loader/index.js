const VueLoaderPlugin = require('./plugin/index');

function loader(){
    console.log("loader ==>")
}


module.exports = loader

module.exports.VueLoaderPlugin = VueLoaderPlugin