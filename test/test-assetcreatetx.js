'use strict';

// usage: node test-assetcreatetx.js

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

var assetData = {
  tokenSymbol: "ST",   //asset Symbol Capital letter A-Z 1-7 digits [A_Z]
   ownerAddress: "wLKf2NqwtHk3BfzK5wMDfbKYN1SC3weyR4",  //asset owner
   tokeName:"SS Token",  //asset token name
   totalSupply:10000000000000000,// total Supply 10^8
   minTable:false    //Whether to increase the number
  }


//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var assetCreateInfo = {
  nTxType: bitcore.WiccApi.ASSET_ISUUE,
  nVersion: 1,
  nValidHeight: 28128, // create height
  srcRegId: "0-1", // sender's regId
  assetData: assetData,
  feesCoinSymbol:WriterHelper.prototype.CoinType.WICC,
  publicKey:"03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
  fees: 50000000000, // fees pay for miner min 500 wicc
};

var wiccPrivateKey = 'YCnMXzTmEbvjMHA8zLHA8ratHH5noPdFEENKfYPa2uVLcmL3wb6H'
console.log("wicc private key:")
console.log(wiccPrivateKey)

var privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey)
//console.log("get private key:")
//console.log(privateKey)
var address = privateKey.toAddress();
console.log("get address:")
console.log(address.toString())

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.ASSET_ISUUE, assetCreateInfo)
console.log("asset create tx raw: ")
console.log(rawtx)
