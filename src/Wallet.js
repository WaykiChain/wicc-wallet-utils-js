var PrivateKey = require('../src/lib/privatekey');
var Hash = require('./lib/crypto/hash');
var ECDSA = require('./lib/crypto/ecdsa');
var _ = require('lodash');

class Wallet {
    constructor(privateKey = "") {
        if (!privateKey || !_.trim(privateKey).length) {
            throw "private key is required"
        }
        if (!PrivateKey.isValid(privateKey) ) {
            throw "Invalid privatekey"
        }
        this.privateKey = privateKey;
        this._getAddress()
    }
    _getAddress() {
        var privKey = PrivateKey.fromWIF(this.privateKey)
        this.address = privKey.toAddress().toString()
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