const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
 

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
                use: [{
                    loader: path.resolve(__dirname, 'babel/one'),
                }],
            }, 
            {
                test: /\.vue$/,
                use: [{
                    loader: path.resolve(__dirname, 'babel/two'),
                }],
            }, 
            {
                test: /\.vue$/,
                use: [{
                    loader: path.resolve(__dirname, 'babel/three'),
                }],
            },
            // {
            //     test: /\.js$/,
            //     use: [{
            //         loader: path.resolve(__dirname, 'babel/two'),
            //     }],
            // }, 
            // {
            //     test: /\.vue$/,
            //     use: [
            //         /* config.module.rule('vue').use('vue-loader') */
            //         {
            //             loader: 'vue-loader',
            //             options: {
            //                 compilerOptions: {
            //                     whitespace: 'condense'
            //                 }
            //             }
            //         }
            //     ]  
            // }
        ]
    },
    plugins:[
        // new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template:'public/index.html',//开发环境需要路径
            inject:'body'
        }),
    ]
}