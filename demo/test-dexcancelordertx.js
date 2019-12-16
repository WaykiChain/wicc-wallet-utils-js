'use strict'
console.error('\n=====RUN-TEST-CANCELORDER-START=====\n')

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13")
/*
Build a transaction for cancel order transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 100000 sawi (0.001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, orderId:pending trading hash
5, feeSymbol: fee type (WICC/WUSD)
*/
/*
构建取消交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 100000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、orderId:挂单的交易hash
5, feeSymbol: 小费类型(WICC/WUSD)
*/
var dexCancelTxinfo = {
  nTxType: 88,
  nValidHeight: 5360,
  fees: 10000,
  feeSymbol: "WICC",
  srcRegId: '',
  orderId: '009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144'
};

var transaction = new WaykiTransaction(dexCancelTxinfo, wallet)
var dexCancelOrderTx = transaction.genRawTx()

console.log("----dexCancelOrderTx----", dexCancelOrderTx)
console.error('\n=====RUN-TEST-CANCELORDERTX-END=====\n')
