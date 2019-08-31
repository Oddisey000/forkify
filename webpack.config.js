const path = require('path');

module.exports = {
    entry: './dev/js/index.js',
    output: {
        path: path.resolve(__dirname, './dev/js'),
        filename: 'bundle-dev.js'
    },
};