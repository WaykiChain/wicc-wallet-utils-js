'use strict';
console.error('\n=====RUN-TEST-MESSAGEVERTIFY-START=====\n')
var WiccApi = require('../index');
var Hash = require('../src/lib/crypto/hash');
var ECDSA = require('../src/lib/crypto/ecdsa');

var msg = "WaykiChain"
var wallet = new WiccApi.Wallet("Y9wDyMys64KVhqwAVxbAB4aYDNVQ4HpRhQ7FLWFC3MhNNXz4JHot")
var signMsg = wallet.signMessage(msg)
console.log("签名消息"+signMsg)
console.log(wallet)
//验证消息
var msgBuff = Buffer.from(msg)
var msgBuffHash = Hash.sha256(Hash.sha256ripemd160(msgBuff));
var pubKey= wallet.publicKeyAsHex();
console.log("公钥："+pubKey)
var vertifySuccess=ECDSA.verify(msgBuffHash, signMsg, pubKey, 'endian')

console.log("验证成功？"+vertifySuccess)
console.error('\n=====RUN-TEST-MESSAGEVERTIFY-END=====\n')
