var WiccWalletLib = Object.create(null)
var WiccApi = require('./src/lib/wiccapi')
var bitcore = require('./src')
var Wallet = require("./src/Wallet")
var WalletManager = require("./src/WalletManager")
var WaykiTransaction = require('./src/WaykiTransaction')

WiccApi = Object.assign(WiccApi, bitcore)

WiccWalletLib.Wallet = Wallet
WiccWalletLib.WalletManager = WalletManager
WiccWalletLib.WaykiTransaction = WaykiTransaction
WiccWalletLib.WiccApi = WiccApi

module.exports = WiccWalletLib