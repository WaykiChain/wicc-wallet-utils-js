'use strict';

// usage: node test-contracttx.js

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = { network: 'testnet' }
var wiccApi = new bitcore.WiccApi(arg)

/*
Build a transaction for calling smart contract
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when calling smart contract , >= 1000000 sawi (0.01 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
*/
/*
构建调用合约的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:调用合约交易时的手续费, >= 1000000 sawi(0.01 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
*/
var invokeAppInfo = {
  nTxType: bitcore.WiccApi.UCOIN_CONTRACT_INVOKE_TX,
  nVersion: 1,
  nValidHeight: 34400,    // create height
  publicKey: "03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
  srcRegId: '0-1',    // sender's regId
  destRegId: "24555-1",  // app regId
  feesCoinType: WriterHelper.prototype.CoinType.WICC,
  coinType: WriterHelper.prototype.CoinType.WUSD,
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

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.UCOIN_CONTRACT_INVOKE_TX, invokeAppInfo)
console.log("contract tx raw: ")
console.log(rawtx)
