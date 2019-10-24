'use strict';
console.error('\n=====RUN-TEST-MESSAGEVERTIFY-START=====\n')
var WiccApi = require('../index');
var Hash = require('../src/lib/crypto/hash');
var ECDSA = require('../src/lib/crypto/ecdsa');

var privateKey = WiccApi.PrivateKey.fromWIF("Y9wDyMys64KVhqwAVxbAB4aYDNVQ4HpRhQ7FLWFC3MhNNXz4JHot")
var msg = "WaykiChain"
var msgBuff = Buffer.from(msg)

var msgBuffHash = Hash.sha256(Hash.sha256ripemd160(msgBuff));
var signMsg = ECDSA.sign(msgBuffHash, privateKey, 'endian')
 console.log("签名消息"+signMsg)
 //验证消息
var pubKey=privateKey.toPublicKey();
console.log("公钥："+pubKey)
var vertifySuccess=ECDSA.verify(msgBuffHash, signMsg, pubKey, 'endian')

console.log("验证成功？"+vertifySuccess)
console.error('\n=====RUN-TEST-MESSAGEVERTIFY-END=====\n')
