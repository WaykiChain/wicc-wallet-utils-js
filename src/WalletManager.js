var Wallet = require('./Wallet')
var WiccApi = require("../src/lib/wiccapi")
var PrivateKey = require('../src/lib/privatekey');

class WalletManager {
    constructor(networkType = "testnet") {
        this.networkType = networkType;
        this.wiccApi = new WiccApi({ network: this.networkType })
    }
    randomMnemonicCodes(language = "ENGLISH") {
        return this.wiccApi.createAllCoinMnemonicCode(language)
    }
    switchMnemonicCodes(mnemonic, targetLanguage) {
        return this.wiccApi.switchMnemonicCode(mnemonic, targetLanguage)
    }
    createWallet(mnemonic) {
        if (!this.wiccApi.checkMnemonicCode(mnemonic)) {
            throw "Invalid mnemonic"
        }
        let walletInfo = this.wiccApi.createWallet(mnemonic, "")
        let key = this.wiccApi.getPriKeyFromSeed(walletInfo.seedinfo, "")
        return new Wallet(key)
    }
    importWalletFromMnemonic(mnemonic) {
        if (!this.wiccApi.checkMnemonicCode(mnemonic)) {
            throw "Invalid mnemonic"
        }
        let privateKey = this.wiccApi.getPriKeyFromMnemonicCode(mnemonic)
        return new Wallet(privateKey)
    }
    importWalletFromPrivateKey(privateKeyWIF) {
        if (!PrivateKey.isValid(privateKeyWIF)) {
            throw "Invalid privatekey"
        }
        return new Wallet(privateKeyWIF)
    }
}

module.exports = WalletManager