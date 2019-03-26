'use strict'

// const express = require("express");
var bitcore = require('..');

var privateKey = bitcore.PrivateKey.fromWIF('Y8JhshTg5j2jeTrwk3qBJDYGi5MVsAvfBJRgFfAp14T91UY9AHgZ')

var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

// 验证地址
var ret = wiccApi.validateAddress('wPcHigM3Gbtbooxyd3YyBXiMintZnfD7cE')
console.log(ret)

var commonTxinfo = {
    nTxType: 3,
    nVersion: 1,
    nValidHeight: 602371,
    fees: 10000,
    srcRegId: '54528-1',
    destAddr: 'wh82HNEDZkZP2eVAS5t7dDxmJWqyx9gr65',
    value:32432,
    network: 'testnet'
  };

  var value = 10000000000
  var tmp = (value >>> 7)


  var commonTx = new bitcore.Transaction.CommonTx(commonTxinfo);
  console.log(commonTx.destAddr)

  /*
    var ret = commonTx._SignatureHash()
  var ret = commonTx._SignatureHash()
  console.log(ret.toString('hex'))

  commonTx._Signtx(privateKey);
  */

  var hex = commonTx.SerializeTx(privateKey)
  console.log(hex)
