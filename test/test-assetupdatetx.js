'use strict';

// usage: node test-assetupdatetx.js

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

//update asset owner regid
var assetUpdateData = {
   updateType:WriterHelper.prototype.UpdateAssetType.OWNER_UID, 
   updateValue:"wbZTWpEnbYoYsedMm2knnP4q7KiSdS3yVq", //owner address
  }

//update asset name
// var assetUpdateData = {
//   updateType:WriterHelper.prototype.UpdateAssetType.NAME,
//   updateValue:"TokenName", //asset name
//  }

//update asset token number
// var assetUpdateData = {
//   updateType: WriterHelper.prototype.UpdateAssetType.MINT_AMOUNT,
//   updateValue: 11000000000000000,  //Increase the number of asset
// }


//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var assetUpdateInfo = {
  nTxType: bitcore.WiccApi.ASSET_UPDATE,
  nVersion: 1,
  nValidHeight: 28128, // create height
  srcRegId: "0-1", // sender's regId
  assetUpdateData: assetUpdateData,
  feesCoinSymbol: WriterHelper.prototype.CoinType.WICC,
  publicKey: "03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
  assetSymbol: "ST",   //Symbol Capital letter A-Z 1-7 digits [A_Z]
  fees: 11000000000, // fees pay for miner min 110 wicc
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
