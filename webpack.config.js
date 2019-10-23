const path = require('path');

module.exports = {
    mode: 'production',
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'wicc-wallet-lib.js',
        library: 'WiccWalletApi',
        libraryTarget: 'umd',
        globalObject: 'this'
    }
}
