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
              use: [
                {
                  loader: path.resolve(__dirname, 'babel/a'),
                }
              ],
              enforce:"pre"
            }, 
            {
              test: /\.vue$/,
              use: [
                {
                  loader: path.resolve(__dirname, 'babel/b'),
                }
              ],
              enforce:"pre"
            },  
            {
              test: /\.vue$/,
              use: [
                {
                  loader: path.resolve(__dirname, 'babel/c'),
                }
              ]
            },
            {
              test: /\.vue$/,
              use: [
                {
                  loader: path.resolve(__dirname, 'babel/d'),
                }
              ],
              enforce:"post"
            },
            {
              test: /\.vue$/,
              use: [
                {
                  loader: path.resolve(__dirname, 'babel/e'),
                }
              ],
              enforce:"post"
            }
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