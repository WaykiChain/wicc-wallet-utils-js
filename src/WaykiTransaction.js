var WiccApi = require("../src/lib/wiccapi")
var PrivateKey = require('../src/lib/privatekey');

class WaykiTransaction {
    constructor(txType, txParams, wallet) {
        this.txType = txType
        this.txParams = txParams
        this.wallet = wallet
    }

    _getNetwork () {
        let network
        if (this.wallet.address[0] === 'w') {
          network = 'testnet'
        } else if (this.wallet.address[0] === 'W') {
          network = 'mainnet'
        }
        return network
      }

    genRawTx () {
        var privKey = PrivateKey.fromWIF(this.wallet.privateKey)
        let network = this._getNetwork()
        let wiccApi = new WiccApi({network: network})
        return wiccApi.createSignTransaction(privKey, this.txType, this.txParams)
    }
    decodeTxRaw(rawTx) {}
}

module.exports = WaykiTransaction