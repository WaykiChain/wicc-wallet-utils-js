'use strict';
console.error('\n=====RUN-TEST-UCONTRACTINVOKETX-START=====\n')
// usage: node test-contracttx.js

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y9f6JFRnYkHMPuEhymC15wHD9FbYBmeV2S6VfDicb4ghNhtXhgAJ")

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
  nTxType: 15,
  nValidHeight: 34400,    // create height
  srcRegId: '0-1',    // sender's regId
  appId: "24555-1",  // app regId
  feeSymbol: "WICC",
  coinSymbol: "WUSD",
  fees: 1000000,         // fees pay for miner
  amount: 8,              // amount of WICC to be sent to the app account
  vContract: "f018"      // contract method, hex format string
};

var transaction = new WaykiTransaction(invokeAppInfo, wallet)
var rawtx = transaction.genRawTx()
console.log("contract tx raw: ")
console.log(rawtx)
console.error('\n=====RUN-TEST-UCONTRACTINVOKETX-END=====\n')