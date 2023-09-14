// const webpack = require('webpack');
const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: "/user.js",
        main_style: "/stylesheet/style.css"
    },
    output: {
        filename: "client.contenthash.js",
        path: path.resolve(__dirname, "public"),
        publicPath: "/"
    },
    plugins: [
      new PugPlugin({
        pretty: true, // formatting HTML, useful for development mode
        js: {
          // output filename of extracted JS file from source script
          filename: 'assets/js/[name].[contenthash:8].js',
        },
        css: {
          // output filename of extracted CSS file from source style
          filename: 'assets/css/[name].[contenthash:8].css',
        },
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
              test: /\.pug$/,
              loader: PugPlugin.loader, // Pug loader
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
                use: ['css-loader'],
            }
        ]
    }
}