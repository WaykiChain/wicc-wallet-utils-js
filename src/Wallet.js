var PrivateKey = require('../src/lib/privatekey');
var Hash = require('./lib/crypto/hash');
var ECDSA = require('./lib/crypto/ecdsa');

class Wallet {
    constructor(privateKey = "") {
        if (!privateKey.length) {
            throw "private key is required"
        }
        this.privateKey = privateKey;
        this._getAddress()
    }
    _getAddress() {
        var priKey = PrivateKey.fromWIF(this.privateKey)
        this.address = priKey.toAddress().toString()
    }
    signMessage(message) {
        var privateKey = PrivateKey.fromWIF(this.privateKey)
        var msgBuff = Buffer.from(message)

        var msgBuffHash = Hash.sha256(Hash.sha256ripemd160(msgBuff));
        return ECDSA.sign(msgBuffHash, privateKey, 'endian')
    }
    publicKeyAsHex() {
        var privateKey = PrivateKey.fromWIF(this.privateKey)
        return privateKey.toPublicKey();
    }
}

module.exports = Wallet