'use strict';
console.error('\n=====RUN-TEST-REGISTERCONTACTTX-START=====\n')

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13")
var _ = require('lodash');
var fs = require("fs")

var script = fs.readFileSync(__dirname + '/data/contract-hello.lua');
//console.log("load script file:")
//console.log(script);

console.log(_.isString(script))
console.log(_.isArray(script))
console.log(_.isArrayBuffer(script))
console.log(_.isBuffer(script))

/*
Build a transaction for deploy smart contract
note:
1, nValidHeight: the height of the block when creating the signature, and the height difference when submitting the broadcast transaction must be <=250
2, fees: handling fee when deploying a smart contract, >= 110000000 sawi (1.1 wicc)
3. The same transaction cannot be submitted repeatedly before it is confirmed(BPS=0.1). It is recommended to solve the problem of batch initiated transaction by adding random handling fee.
*/
/*
构建发布合约的交易单
注意：
1、nValidHeight:创建签名时的区块高度,与提交广播交易时的高度差必须 <=250
2、fees:发布合约时的手续费, >= 110000000 sawi(1.1 wicc)
3、相同的交易在未被确认前不能重复提交(BPS=0.1),建议采用添加随机手续费方式解决批量发起交易问题
*/
var regAppInfo = {
  nTxType: 5,
  nValidHeight: 110482,       // create height
  srcRegId: "0-1",      // sender's regId
  vContract: script,            // contract scrypt content, string or buf
  description: "test contract",            // contract scrypt description, string or buf
  fees: 4200000000,           // fees pay for miner
};


var transaction = new WaykiTransaction(regAppInfo, wallet)
var rawtx = transaction.genRawTx()
console.log("reg app tx raw: ")
console.log(rawtx)
console.error('\n=====RUN-TEST-REGISTERCONTACTTX-END=====\n')