'use strict';
console.error('\n=====RUN-TEST-SIGNTXID-START=====\n')
var ECDSA = require('../src/lib/crypto/ecdsa');
var PrivateKey = require('../src/lib/privatekey');
var BufferWriter = require('../src/lib/encoding/bufferwriter');

var txId = "b443ded378f4d4a17c9ff79500dc3c438b93cdf3f27b628297715815eaa0b60d"
var privateKey = PrivateKey.fromWIF("Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13")
var msgBuff = Buffer.from(txId, 'hex')
var buff=BufferWriter().writeReverse(msgBuff).toBuffer()
var sig = ECDSA.sign(buff, privateKey, 'endian')
var sigHex = sig.toBuffer().toString('hex')
console.log("签名成功"+sigHex)
console.error('\n=====RUN-TEST-SIGNTXID-END=====\n')