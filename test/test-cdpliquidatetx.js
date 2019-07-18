'use strict'

// const express = require("express");
var bitcore = require('..');

var privateKey = bitcore.PrivateKey.fromWIF('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')

var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

// 验证地址
var ret = wiccApi.validateAddress('wPcHigM3Gbtbooxyd3YyBXiMintZnfD7cE')
console.log(ret)

/*
Build a transaction for common transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 10000 sawi (0.0001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
*/
/*
构建普通转账交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
*/
var cdpliquidateTxinfo = {
    nTxType: bitcore.WiccApi.CDP_LIQUIDATE_TX,
    nVersion: 1,
    nValidHeight: 23594,
    txUid:"0-1",
    fees: 100000,
    cdpOwnerRegId:"0-1",
    cdpTxId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",//"bcbd362b8520a64dc34e63e6dd60b7cbed2e2b5c4f82b9841cf537edda067628",//"0000000000000000000000000000000000000000000000000000000000000000",
    scoinsToLiquidate: 2000000000000,
    scoinsPenalty: 7000000,
    network: 'testnet'
  };


  var cdpliquidateTx = new bitcore.Transaction.CdpLiquiDateTx(cdpliquidateTxinfo);
  console.log(cdpliquidateTx.bcoinsToStake)

  var hex = cdpliquidateTx.SerializeTx(privateKey)
  console.log(hex)
