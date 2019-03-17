const merge = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = merge(base, {
    mode: 'development',
    devServer: {
        inline: true,
        historyApiFallback: true
    },
    devtool: '#eval-source-map', // To show console output from original file instead of showing from bundle file
});