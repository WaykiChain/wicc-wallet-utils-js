'use strict'
console.error('\n=====RUN-TEST-DEXBUYLIMITORDERTX-START=====\n')

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13")
/*
Build a transaction for dex buy limit transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 100000 sawi (0.001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, coinType: currency type
5, assetType: asset type
6, assetAmount: the amount of assets
7, bidPrice: price
*/
/*
构建普通限价买交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 100000 sawi(0.001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、coinType:币种类型
5、assetType:资产类型
6、assetAmount:资产金额
7、bidPrice:价格
*/
var dexBuyLimitTxinfo = {
    nTxType: 84,
    nValidHeight: 5360,
    fees: 10000,
    srcRegId: '0-1',
    feeSymbol: "WICC",
    coinSymbol: "WUSD",
    assetSymbol:"WICC",
    assetAmount:10,
    price:200
  };

  var transaction = new WaykiTransaction(dexBuyLimitTxinfo, wallet)
  var dexBuyLimitOrderTx = transaction.genRawTx()

  console.log("----dexBuyLimitOrderTx----", dexBuyLimitOrderTx)
  console.error('\n=====RUN-TEST-DEXBUYLIMITORDERTX-END=====\n')
