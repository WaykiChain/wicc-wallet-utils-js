'use strict'

// const express = require("express");
var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var privateKey = bitcore.PrivateKey.fromWIF('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')

/*
Build a transaction for cdp redeem
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 100000 sawi (0.001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, cdpTxId: cdp transaction hash
5, assetAmount: stake coin amount
6, assetSymbol: stake asset symbol
7, fee_symbol: fee type (WICC/WUSD)
*/
/*
构建cdp赎回的交易
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 100000 sawi(0.001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、cdpTxId:cdp交易hash
5、scoins_to_repay:销毁的wusd数量
6、assetAmount:赎回的数量
7、assetSymbol: 赎回币种类型
8、fee_symbol:小费类型（WICC/WUSD）
*/
var assetSymbol=WriterHelper.prototype.CoinType.WICC
var assetAmount=100000000
var map=new Map([[assetSymbol,assetAmount]])
var cdpRedeemTxinfo = {
    nTxType: bitcore.WiccApi.CDP_REDEEMP_TX,
    nVersion: 1,
    nValidHeight: 78,
    txUid:"",
    fees: 100000,
    cdpTxId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
    publicKey:"03af0341d7470d6e02687bec8920dbfba83544571a71f1cd6ef487c7fd88768c01",
    fee_symbol:WriterHelper.prototype.CoinType.WICC,
    scoins_to_repay: 0,
    assetMap: map,
    network: 'testnet'
  };


  var cdpRedeemTx = new bitcore.Transaction.CdpRedeemTx(cdpRedeemTxinfo);

  var hex = cdpRedeemTx.SerializeTx(privateKey)
  console.log(hex)
