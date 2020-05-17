const path = require('path');

module.exports = {
    
    entry: {
        index:'./src/city/viewByCities.js',
        patient:'./src/patient/viewByPatient.js',
        home:'./src/home/homePage.js'},
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
