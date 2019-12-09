'use strict'
console.error('\n=====RUN-TEST-CDPLIQUIDATETX-START=====\n')
// const express = require("express");
var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13")

/*
Build a transaction for cdp liquidate transaction
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 1000000 sawi (0.01 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4. cdpOwnerRegId: reg of the cdp creator
5. cdpTxId: the transaction hash created by the cdp
6. scoinsToLiquidate: the number of liquidation
7, fee_symbol: fee type (WICC/WUSD)
8、assetSymbol:get stake coin symbol
*/
/*
构建cdp清算交易
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、cdpOwnerRegId:cdp创建者的regid
5、cdpTxId:该cdp的创建的交易hash
6、scoinsToLiquidate:清算的数量
7、fee_symbol:小费类型（WICC/WUSD）
8、assetSymbol:赎回币种类型
*/
var cdpliquidateTxinfo = {
  nTxType: 23,
  nValidHeight: 501,
  srcRegId: "",
  fees: 100000,
  feeSymbol: "WICC",
  cdpTxId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
  sCoinsToLiquidate: 2000000000000,
  liquidateAssetSymbol: "WICC"
};


var transaction = new WaykiTransaction(cdpliquidateTxinfo, wallet)
var cdpliquidateTx = transaction.genRawTx()
console.log("-----cdpliquidateTx-----", cdpliquidateTx)

console.error('\n=====RUN-TEST-CDPLIQUIDATETX-END=====\n')