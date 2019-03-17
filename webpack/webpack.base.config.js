const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            './main.js',            
        ],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg|woff|woff2|ttf|eot)$/i, // For the file image file importing
                use: 'file-loader',
            },
            {
                test: /\.jsx?$/, // To load jsx files, loader used is babel-loader, which transpiles jsx to js
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-proposal-export-default-from",
                        "@babel/plugin-proposal-export-namespace-from",
                        "@babel/plugin-proposal-object-rest-spread"
                    ],
                    presets: ['@babel/preset-react', '@babel/preset-env'] // presets are required to tell webpack which version we are using.
                }
            },
            {
                test: /\.s?css$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, '../src'), 'node_modules'], // used to make use of absolute import
        extensions: ['*', '.js', '.jsx', '.json'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            publicPath: 'src/assets/images'//Specify the path of the favicon here
        })
    ]
};

// Note: In production check sass-loader once.