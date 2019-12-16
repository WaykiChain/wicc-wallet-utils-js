'use strict'
console.error('\n=====RUN-TEST-CDPREDEEMTX-START=====\n')

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13")
/*
Build a transaction for cdp redeem
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 1000000 sawi (0.01 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, cdpTxId: cdp transaction hash
5, assetAmount: stake coin amount
6, assetSymbol: stake asset symbol
7, feeSymbol: fee type (WICC/WUSD)
8, regid of the cdp creator
9, sCoinsToRepay: stake redeem amount
*/
/*
构建cdp赎回的交易
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 1000000 sawi(0.01 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、cdpTxId:cdp交易hash
5、sCoinsToRepay:销毁的wusd数量
6、assetAmount:赎回的数量
7、assetSymbol: 赎回币种类型
8、feeSymbol:小费类型（WICC/WUSD）
9、srcRegId: 创建者的regid
*/
var assetSymbol = "WICC"
var assetAmount = 100000000
var map = new Map([[assetSymbol, assetAmount]])
var cdpRedeemTxinfo = {
  nTxType: 22,
  nValidHeight: 78,
  srcRegId: "",
  fees: 1000000,
  cdpTxId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
  feeSymbol: "WICC",
  sCoinsToRepay: 0,
  assetMap: map
};

var transaction = new WaykiTransaction(cdpRedeemTxinfo, wallet)
var cdpRedeemTx = transaction.genRawTx()

console.log('----cdpRedeemTx----', cdpRedeemTx)

console.error('\n=====RUN-TEST-CDPREDEEMTX-END=====\n')
