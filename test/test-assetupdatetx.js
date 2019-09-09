'use strict';

// usage: node test-contracttx.js

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

// var assetUpdateData = {
//    updateType:WriterHelper.prototype.UpdateAssetType.OWNER_UID,
//    updateValue:"0-2",
//   }

// var assetUpdateData = {
//   updateType:WriterHelper.prototype.UpdateAssetType.NAME,
//   updateValue:"TestName",
//  }

var assetUpdateData = {
  updateType: WriterHelper.prototype.UpdateAssetType.MINT_AMOUNT,
  updateValue: 10000000000000000,
}


//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var assetUpdateInfo = {
  nTxType: bitcore.WiccApi.ASSET_UPDATE,
  nVersion: 1,
  nValidHeight: 28128, // create height
  srcRegId: "0-1", // sender's regId
  assetUpdateData: assetUpdateData,
  feesCoinSymbol: WriterHelper.prototype.CoinType.WICC,
  publicKey: "03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
  assetSymbol: "TestCoin",
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

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.ASSET_UPDATE, assetUpdateInfo)
console.log("asset update tx raw: ")
console.log(rawtx)
