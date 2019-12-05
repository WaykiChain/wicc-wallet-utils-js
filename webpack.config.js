const path = require('path');

module.exports = {
    mode: 'production',
    entry: ["babel-polyfill", "./index.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'wicc-wallet-lib.js',
        library: 'WiccWalletApi',
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
