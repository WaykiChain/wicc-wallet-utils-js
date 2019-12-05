var Wallet = require('./Wallet')
var WiccApi = require("../src/lib/wiccapi")

class WalletManager {
    constructor(networkType = "testnet") {
        this.networkType = networkType;
        this.wiccApi = new WiccApi({ network: this.networkType })
    }
    randomMnemonicCodes(language = "ENGLISH") {
        return this.wiccApi.createAllCoinMnemonicCode(language)
    }
    createWallet(mnemonic) {
        let walletInfo = this.wiccApi.createWallet(mnemonic, "")
        let key = this.wiccApi.getPriKeyFromSeed(walletInfo.seedinfo, "")
        return new Wallet(key)
    }
    importWalletFromMnemonic(mnemonic) {
        let privateKey = this.wiccApi.getPriKeyFromMnemonicCode(mnemonic)
        return new Wallet(privateKey)
    }
    importWalletFromPrivateKey(privateKeyWIF) {
        return new Wallet(privateKeyWIF)
    }
}

module.exports = WalletManager