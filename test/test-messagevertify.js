'use strict';
var bitcore = require('..');
var Hash = require('../lib/crypto/hash');
var ECDSA = require('../lib/crypto/ecdsa');

var privateKey = bitcore.PrivateKey.fromWIF("Y9dJaHVk7Rs4sVq1Uk8TGLW4PQzzesA7Lss2Xz1inZY9KMfHBSPE")
var msg = "WaykiChain"
var msgBuff = Buffer.from(msg)
var msgBuffHash = Hash.sha256sha256(msgBuff);
var signMsg = ECDSA.sign(msgBuffHash, privateKey, 'endian')

console.log("签名消息"+signMsg)

//验证消息
var pubKey=privateKey.toPublicKey();
var vertifySuccess=ECDSA.verify(msgBuffHash, signMsg, pubKey, 'endian')

console.log("验证成功？"+vertifySuccess)