'use strict';

// usage: node test-contracttx.js

var bitcore = require('..');


var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)



//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var regAppInfo = {
  nTxType: bitcore.WiccApi.CONTRACT_TX,
  nVersion: 1,
  nValidHeight: 34400,    // create height
  srcRegId: "22030-2",    // sender's regId
  destRegId: "24555-1",  // app regId
  fees: 1000000,         // fees pay for miner
  value: 8,              // amount of WICC to be sent to the app account
  vContract: "f018"      // contract method, hex format string
};

var wiccPrivateKey = 'Y9f6JFRnYkHMPuEhymC15wHD9FbYBmeV2S6VfDicb4ghNhtXhgAJ'
console.log("wicc private key:")
console.log(wiccPrivateKey)

var privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey)
//console.log("get private key:")
//console.log(privateKey)
var address = privateKey.toAddress();
console.log("get address:")
console.log(address.toString())

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.CONTRACT_TX, regAppInfo)
console.log("contract tx raw: ")
console.log(rawtx)
