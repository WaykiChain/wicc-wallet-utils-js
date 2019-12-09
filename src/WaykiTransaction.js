var WiccApi = require("../src/lib/wiccapi")
var PrivateKey = require('../src/lib/privatekey');
var transactionParams = require("./transactionParams")

class WaykiTransaction {
    constructor(txParams, wallet) {
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
        let params = transactionParams(this.txParams, this.wallet)
        let wiccApi = new WiccApi({network: this._getNetwork()})
        return wiccApi.createSignTransaction(privKey, params)
    }
    decodeTxRaw(rawTx) {}
}

module.exports = WaykiTransaction