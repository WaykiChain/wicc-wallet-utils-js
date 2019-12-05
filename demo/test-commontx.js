'use strict'
console.error('\n=====RUN-TEST-COMMONTX-START=====\n')
// const express = require("express");
var WiccApi = require('../index');

var privateKey = WiccApi.PrivateKey.fromWIF('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')

var arg = {network: 'testnet'}
var wiccApi = new WiccApi(arg)

// 验证地址
var ret = wiccApi.validateAddress('wPcHigM3Gbtbooxyd3YyBXiMintZnfD7cE')
console.log(ret)

/*
Build a transaction for common transfer
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 100000000 sawi (0.1 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
*/
/*
构建普通转账交易的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 10000 sawi(0.0001 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
*/
var commonTxinfo = {
    nTxType: 3,
    nVersion: 1,
    nValidHeight: 34550,
    publicKey:"03e93e7d870ce6f1c9997076c56fc24e6381c612662cd9a5a59294fac9ba7d21d7",
    fees: 10000,
    srcRegId: '0-1',
    destAddr: 'wWTStcDL4gma6kPziyHhFGAP6xUzKpA5if',
    value:1100000000000,
    memo:"test transfer",
    network: 'testnet'
  };

  var value = 10000000000
  var tmp = (value >>> 7)


  var commonTx = wiccApi.createSignTransaction(privateKey, WiccApi.COMMON_TX, commonTxinfo)
  console.log("----commonTx----", commonTx)
  console.error('\n=====RUN-TEST-COMMONTX-END=====\n')
