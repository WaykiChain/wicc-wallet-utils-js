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
Build a transaction for cdp stake transaction
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 10000 sawi (0.0001 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
4, cdpTxId: hash created by cdp
5, bcoinsToStake: the number of redemption of cdp
6, collateralRatio: cdp mortgage ratio
7, scoinsInterest: cdp interest rate
*/
/*
构建cdp抵押交易
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
4、cdpTxId:cdp创建的hash
5、bcoinsToStake:cdp赎回的数量
6、collateralRatio:cdp抵押比率
7、scoinsInterest:cdp利率
*/
var cdpStakeTxinfo = {
    nTxType: bitcore.WiccApi.CDP_STAKE_TX,
    nVersion: 1,
    nValidHeight: 23594,
    txUid:"0-1",
    fees: 100000,
    cdpTxId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
    bcoinsToStake: 2000000000000,
    collateralRatio: 7000000,
    scoinsInterest: 10,
    network: 'testnet'
  };


  var cdpStakeTx = new bitcore.Transaction.CdpStakeTx(cdpStakeTxinfo);
  console.log(cdpStakeTx.bcoinsToStake)

  var hex = cdpStakeTx.SerializeTx(privateKey)
  console.log(hex)
