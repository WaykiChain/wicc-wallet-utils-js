'use strict';
console.error('\n=====RUN-TEST-DELEGATE-START=====\n')

var { WaykiTransaction, Wallet } = require("../index")
var wallet = new Wallet("YCnMXzTmEbvjMHA8zLHA8ratHH5noPdFEENKfYPa2uVLcmL3wb6H")
/*
publicKey can get from "getaccountinfo" cmd if the account have registered
*/
var delegateData = [ // array,  item is object data of delegate
  {
    srcRegId: "0369e834a7e5708d4c94b098447fbead8213c679cf4a37b953bfed28af104239d3", // regid of whom to be delegated
    voteValue: 201 // delegate amount
  },{
    srcRegId: "02dc40112e2e12106c749c5bee34b4037b2dff4cd300ee5a57948961a6c9441e27",
    voteValue: 202 
  }
]

//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var delegateInfo = {
  nTxType: 6,
  nValidHeight: 28128, // create height
  userId: "", // sender's regId
  voteLists: delegateData,
  fees: 1000000, // fees pay for miner, >= 1000000 sawi (0.01 wicc)
};

var transaction = new WaykiTransaction(delegateInfo, wallet)
var rawtx = transaction.genRawTx()
console.log("contract tx raw: ")
console.log(rawtx)

console.error('\n=====RUN-TEST-DELEGATE-END=====\n')
