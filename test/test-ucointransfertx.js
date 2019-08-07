'use strict'

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')

var privateKey = bitcore.PrivateKey.fromWIF('Y8JhshTg5j2jeTrwk3qBJDYGi5MVsAvfBJRgFfAp14T91UY9AHgZ')

/*
Build a transaction for common transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 10000 sawi (0.0001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, srcRegId: the regid of the transferor
5, value: transfer amount
6, coinType: currency type
7, feesCoinType: fees type
*/
/*
构建转账交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、srcRegId:转账者的regid
5、value:转账金额
6、coinType:币种类型
7、feesCoinType:小费类型
*/
var cointransferTxinfo = {
    nTxType:  bitcore.WiccApi.UCOIN_TRANSFER_TX,
    nVersion: 1,
    nValidHeight: 602371,
    fees: 10000,
    srcRegId: '54528-1',
    destAddr: 'wh82HNEDZkZP2eVAS5t7dDxmJWqyx9gr65',
    value:32432,
    memo:"转账",
    coinType:WriterHelper.prototype.CoinType.WUSD,
    feesCoinType:WriterHelper.prototype.CoinType.WICC,
    network: 'testnet'
  };

  var cointransferTx = new bitcore.Transaction.UCoinTransferTx(cointransferTxinfo);
  console.log(cointransferTx.destAddr)

  var hex = cointransferTx.SerializeTx(privateKey)
  console.log(hex)
