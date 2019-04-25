const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const Visualizer = require('webpack-visualizer-plugin');
var webpack = require('webpack');
var config = require('./env.config');

module.exports = merge(base, {
    mode: 'development',
    devServer: {
        inline: true,
        historyApiFallback: true
    },
    plugins: [
        new Visualizer({
            filename: './statistics.html' // statistics.html will view the bundle.js usages.
        }),
        new webpack.DefinePlugin({
            process: {
                env: {
                    'ROOT_URL': JSON.stringify(config.DEVELOPMENT.ROOT_URL),
                }
            }
        })
    ],
    devtool: '#eval-source-map', // To show console output from original file instead of showing from bundle file
});