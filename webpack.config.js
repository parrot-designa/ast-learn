const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
// const { VueLoaderPlugin } = require('./vue-loader'); 
const { VueLoaderPlugin } = require('vue-loader'); 
 

module.exports = { 
    mode:"development",
    entry: "./src/main.js",
    devServer:{
        port:8089,
        static:'public'
    },
    module:{
        rules:[
            {
                test: /\.vue$/,
                // loader:path.resolve(__dirname, 'vue-loader')
                loader: 'vue-loader'
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(), 
        new HtmlWebpackPlugin({
            template:'public/index.html',//开发环境需要路径
            inject:'body'
        }),
    ]
}