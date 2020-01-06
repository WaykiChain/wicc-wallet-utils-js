const path = require('path');
const ver = require("./package.json").version

module.exports = {
    mode: 'production',
    entry: ["babel-polyfill", "./index.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: `wicc-wallet-lib-${ver}.js`,
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
