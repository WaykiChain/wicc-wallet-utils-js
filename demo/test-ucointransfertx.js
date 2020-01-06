'use strict'
console.error('\n=====RUN-TEST-UCOINTRANSFERTX-START=====\n')

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y8JhshTg5j2jeTrwk3qBJDYGi5MVsAvfBJRgFfAp14T91UY9AHgZ")

/*
Build a transaction for common transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee , >= 100000 sawi (0.001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, srcRegId: the regid of the transferor
5, transferAmount: transfer amount
6, coinSymbol: currency type
7, feeSymbol: fees type
8, destAddress: receiver‘s address
*/
/*
构建转账交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:手续费, >= 100000 sawi(0.001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、srcRegId:转账者的regid
5、transferAmount:转账金额
6、coinSymbol:币种类型
7、feeSymbol:小费类型,
8、destAddress:收款地址
*/

var coinSymbol = "WUSD"
var destAddr = 'wh82HNEDZkZP2eVAS5t7dDxmJWqyx9gr65'
var transferAmount = 32432
var destArr = [{
  "coinSymbol": coinSymbol,
  "destAddress": destAddr,
  "transferAmount": transferAmount
}
]
var cointransferTxinfo = {
  nTxType: 11,
  nValidHeight: 602371,
  fees: 10000,
  srcRegId: '',
  dests: destArr,
  memo: "test transfer",// remark
  feeSymbol: "WICC"
};

var transaction = new WaykiTransaction(cointransferTxinfo, wallet)
var cointransferTx = transaction.genRawTx()
console.log("----cointransferTx----", cointransferTx)
console.error('\n=====RUN-TEST-UCOINTRANSFERTX-END=====\n')

