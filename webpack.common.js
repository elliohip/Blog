const path = require('path');

const PugPlugin = require('pug-plugin');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: "/user.js",
        layout: "../views/layout.pug",
        "/sign_up": "../views/sign_up.pug"
    },
    output: {
        // filename: "client.[contenthash].js",
        path: path.resolve(__dirname, "public"),
        publicPath: "/"
    },
    plugins: [
      new PugPlugin({
        pretty: true, // formatting HTML, useful for development mode
        js: {
          // output filename of extracted JS file from source script
          filename: 'client.[contenthash:8].js',
        },
        css: {
          // output filename of extracted CSS file from source style
          filename: 'style.[contenthash:8].css',
        },
      })
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
              oneOf: [
                // import Pug in JavaScript/TypeScript as template function
                {
                  issuer: /\.(js|ts)$/, // match scripts where Pug is used
                  loader: PugPlugin.loader,
                  options: {
                    method: 'compile', // compile Pug into template function
                  },
                },
                // render Pug from Webpack entry into static HTML
                {
                  loader: PugPlugin.loader, // default method is 'render'
                },
              ],
            },      
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader",
            },
            {
             test: /\.(png|svg|jpg|gif)$/,
             use: ['file-loader']
            },
            {
              test: /\.css$/i,
              use: ['css-loader'],
            },
            
        ]
    }
}