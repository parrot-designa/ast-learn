const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const VuePlugin = require('./plugin/index');
 

module.exports = { 
    mode:"development",
    entry: "./src/main.js",
    devServer:{
        port:8080,
        static:'public'
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader:'vue-loader'
            }
        ]
    },
    plugins:[
        // new VueLoaderPlugin(),
        new VuePlugin(),
        new HtmlWebpackPlugin({
            template:'public/index.html',//开发环境需要路径
            inject:'body'
        }),
    ]
}