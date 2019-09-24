'use strict';

// usage: node test-assetcreatetx.js

/*
Build a transaction for asset create
note:
In addition to publishing assets miners fee, we need additional deduction 550WICC

1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when calling smart contract , >= 1000000 sawi (0.01 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4. assetSymbol: Asset symbols, publishing success can not be modified (asset Symbol Capital letter A-Z 1-7 digits [A_Z])
5. ownerAddress: asset owner
6. tokeName: asset name
7. totalSupply: total asset circulation
8. minTable: Whether the asset can be issued 
9、feesCoinSymbol: fee type(WICC/WUSD)
*/
/*
构建发布资产交易

发布资产除了矿工费,还需额外扣除550WICC

注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:调用合约交易时的手续费, >= 1000000 sawi(0.01 wicc)
3、同一笔交易在确认之前无法重复提交（BPS = 0.1）。 建议通过增加随机手续费来解决批量启动交易的问题。
4、assetSymbol: 资产符号，发布成功无法再修改(1-7位大写字母)
5、ownerAddress: 资产拥有者
6、assetName: 资产名称
7、totalSupply: 资产总发行量
8、minTable: 资产是否可以增发
9、feesCoinSymbol: 小费类型(WICC/WUSD)
*/

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

var assetData = {
  assetSymbol: "ST",   //asset Symbol Capital letter A-Z 1-7 digits [A_Z]
   ownerAddress: "wLKf2NqwtHk3BfzK5wMDfbKYN1SC3weyR4",  //asset owner
   assetName:"SS Token",  //asset token name
   totalSupply:10000000000000000,// total Supply *10^8
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
