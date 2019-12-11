const path = require('path');

module.exports = {
    mode: 'production',
    entry: ["babel-polyfill", "./index.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'wicc-wallet-lib-2.0.js',
        library: 'wicc-wallet-lib',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}
