const path = require('path');

module.exports = {
    
    entry: {
        index:'./src/city/index.js',
        patient:'./src/patient/index.js',
        home:'./src/home/index.js'},
    output: {
        filename: '[name].js',
        // filename: 'bundle.js',
        path: path.resolve(__dirname,'dist')
    },
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     exclude: /node_modules|sortable/,
            //     loader: 'eslint-loader'
            // }

        ]
    },
    mode: 'development',
    devtool: 'eval-source-map'
};
