const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var htmlwebpackplugin = require("html-webpack-plugin");
// const PugPlugin = require('pug-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: "/user.js"
    },
    output: {
        filename: "client.[contenthash].js",
        path: path.resolve(__dirname, "public"),
        publicPath: "/"
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: "style.[contenthash].css",
        }),
        
    ],
    module: {
        rules: [
            {
              enforce: "pre",
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "eslint-loader",
              options: {
                emitWarning: true,
                failOnError: false,
                failOnWarning: false
              }
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader",
            },
            {
              // Loads the javacript into html template provided.
              // Entry point is set below in HtmlWebPackPlugin in Plugins 
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader",
                  //options: { minimize: true }
                }
              ]
            },
            {
             test: /\.(png|svg|jpg|gif)$/,
             use: ['file-loader']
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            
        ]
    }
}