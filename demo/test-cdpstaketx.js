'use strict'
console.error('\n=====RUN-TEST-CDPSTAKETX-START=====\n')
// const express = require("express");
var WiccApi = require('../index');
var WriterHelper = require('../src/lib/util/writerhelper')
var privateKey = WiccApi.PrivateKey.fromWIF('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')

var arg = {network: 'testnet'}
var wiccApi = new WiccApi(arg)

// 验证地址
var ret = wiccApi.validateAddress('wPcHigM3Gbtbooxyd3YyBXiMintZnfD7cE')
console.log(ret)

/*
Build a transaction for cdp stake transaction
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 1000000 sawi (0.01 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
5、assetAmount:stake coin amount
6、scoinsToMint:get coin amount
7、fee_symbol:fee symbol（WICC/WUSD）
8、assetAmount:stake coin symbol
9、coin_symbol:get coind symbol
*/
/*
构建cdp抵押交易
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 100000 sawi(0.001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、cdpTxId:cdp创建生成的交易hash
5、assetAmount:抵押的数量(最低1WICC)
6、scoinsToMint:获得的wusd
7、fee_symbol:小费类型（WICC/WUSD）
8、assetAmount:抵押币种
9、coin_symbol:获得币种
*/
var assetSymbol=WriterHelper.prototype.CoinType.WICC
var assetAmount=100000000
var map=new Map([[assetSymbol,assetAmount]])
var cdpStakeTxinfo = {
    nTxType: WiccApi.CDP_STAKE_TX,
    nVersion: 1,
    nValidHeight: 25,
    txUid:"0-1",
    fees: 100000,
    fee_symbol:WriterHelper.prototype.CoinType.WICC,
    cdpTxId: "0b9734e5db3cfa38e76bb273dba4f65a210cc76ca2cf739f3c131d0b24ff89c1",
    publicKey:"03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
    assetMap:map,
    scoin_symbol:WriterHelper.prototype.CoinType.WUSD,
    scoinsToMint: 0,
    network: 'testnet'
  };


  var cdpStakeTx = wiccApi.createSignTransaction(privateKey, WiccApi.CDP_STAKE_TX, cdpStakeTxinfo)

  console.log("----cdpStakeTx----", cdpStakeTx)

  console.error('\n=====RUN-TEST-CDPSTAKETX-END=====\n')