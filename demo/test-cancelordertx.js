'use strict'
console.error('\n=====RUN-TEST-CANCELORDER-START=====\n')
var WiccApi = require('../index');
var WriterHelper = require('../src/lib/util/writerhelper')
var privateKey = WiccApi.PrivateKey.fromWIF('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')
var arg = { network: 'testnet' }
var wiccApi = new WiccApi(arg)
/*
Build a transaction for cancel order transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 100000 sawi (0.001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, orderId:pending trading hash
5, fee_symbol: fee type (WICC/WUSD)
*/
/*
构建取消交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、orderId:挂单的交易hash
5, fee_symbol: 小费类型(WICC/WUSD)
*/
var dexCancelTxinfo = {
  nTxType: WiccApi.DEX_CANCEL_ORDER_TX,
  nVersion: 1,
  nValidHeight: 5360,
  fees: 10000,
  feeSymbol: WriterHelper.prototype.CoinType.WICC,
  srcRegId: '',
  publicKey: "03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
  orderId: '009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144',
  network: 'testnet'
};

var dexCancelOrderTx = wiccApi.createSignTransaction(privateKey, WiccApi.DEX_CANCEL_ORDER_TX, dexCancelTxinfo);

console.log("----dexCancelOrderTx----", dexCancelOrderTx)
console.error('\n=====RUN-TEST-CANCELORDERTX-END=====\n')
