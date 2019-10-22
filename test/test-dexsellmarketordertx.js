'use strict'

// const express = require("express");
var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var privateKey = bitcore.PrivateKey.fromWIF('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')
var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

/*
Build a transaction for sell limit transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 100000 sawi (0.001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
*/
/*
构建限价卖单交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 100000 sawi(0.001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
*/
var dexSellMarketTxinfo = {
    nTxType: bitcore.WiccApi.DEX_SELL_MARKET_ORDER_TX,
    nVersion: 1,
    nValidHeight: 602371,
    fees: 10000,
    srcRegId: '0-1',
    publicKey:"03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
    feeSymbol: WriterHelper.prototype.CoinType.WICC,
    coinSymbol: WriterHelper.prototype.CoinType.WUSD,
    assetSymbol:WriterHelper.prototype.CoinType.WICC,
    assetAmount:30000000000,
    network: 'testnet'
  };

  var dexSellMarketOrderTx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.DEX_SELL_MARKET_ORDER_TX, dexSellMarketTxinfo)
  console.log("----dexSellMarketOrderTx----", dexSellMarketOrderTx)
