var WiccApi = require('./src/lib/wiccapi')
var bitcore = require('./src')
var Wallet = require("./src/Wallet")
var WalletManager = require("./src/WalletManager")

WiccApi = Object.assign(WiccApi, bitcore)
WiccApi.Wallet = Wallet
WiccApi.WalletManager = WalletManager

module.exports = WiccApi