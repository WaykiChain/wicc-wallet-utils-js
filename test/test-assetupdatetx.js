'use strict';

// usage: node test-assetupdatetx.js

/*
Build a transaction for asset update

In addition to updating assets miners fee, we need additional deduction 110WICC

note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when calling smart contract , >= 1000000 sawi (0.01 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4. assetSymbol: Asset symbols, publishing success can not be modified
5、feesCoinSymbol: fee type(WICC/WUSD)
6、 updateType: update type 1: asset owner 2: asset name 3. number of assets
*/
/*
构建发布资产交易

更新资产除了矿工费,还需额外扣除110WICC

注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:调用合约交易时的手续费, >= 1000000 sawi(0.01 wicc)
3、同一笔交易在确认之前无法重复提交（BPS = 0.1）。 建议通过增加随机手续费来解决批量启动交易的问题。
4、assetSymbol: 资产符号，发布成功无法再修改
5、feesCoinSymbol: 小费类型(WICC/WUSD)
6、updateType:更新类型 1:资产拥有者 2:资产名称 3.资产数量
*/

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

//update asset owner regid
// var assetUpdateData = {
//    updateType:WriterHelper.prototype.UpdateAssetType.OWNER_UID, 
//    updateValue:"wbZTWpEnbYoYsedMm2knnP4q7KiSdS3yVq", //owner address
//   }

//update asset name
// var assetUpdateData = {
//   updateType:WriterHelper.prototype.UpdateAssetType.NAME,
//   updateValue:"TokenName", //asset name
//  }

//update asset token number
var assetUpdateData = {
  updateType: WriterHelper.prototype.UpdateAssetType.MINT_AMOUNT,
  updateValue: 11000000000000000,  //Increase the number of asset
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
  assetSymbol: "LOLLL",   //Symbol Capital letter A-Z 1-7 digits [A_Z]
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
