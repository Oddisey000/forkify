const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './dev/js/index.js'],
    output: {
        path: path.resolve(__dirname, './dev/js'),
        filename: 'bundle-dev.js'
    },
    module: {
        rules: [{
            test: /\.js/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
};