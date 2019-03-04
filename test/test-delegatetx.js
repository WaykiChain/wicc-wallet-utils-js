'use strict';

// usage: node test-contracttx.js

var bitcore = require('..');

var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

/*
publicKey can get from "getaccountinfo" cmd if the account have registered
*/
var delegateData = [ // array,  item is object data of delegate
  {
    // address: 'waFdYrQfDSsh1jVsDzPiutAPUKCHZJ4Wyp'
    // publicKey: Buffer.from("02e5ee9bd73c561fc9844fc3065c87d297f6ba52f64f409346a4bb5035f2de25ab", 'hex'),
    publicKey: "0369e834a7e5708d4c94b098447fbead8213c679cf4a37b953bfed28af104239d3",
    votes: 201
  },{
    // address: 'wQsRcb6VcSr9DnpaLiWwrSA6YPuaUMbbYw'
    publicKey: "02dc40112e2e12106c749c5bee34b4037b2dff4cd300ee5a57948961a6c9441e27",
    votes: 202
  }
]

//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var regAppInfo = {
  nTxType: bitcore.WiccApi.DELEGATE_TX,
  nVersion: 1,
  nValidHeight: 28128, // create height
  srcRegId: "28121-3", // sender's regId
  delegateData: delegateData,
  fees: 1001, // fees pay for miner
};

var wiccPrivateKey = 'YCnMXzTmEbvjMHA8zLHA8ratHH5noPdFEENKfYPa2uVLcmL3wb6H'
console.log("wicc private key:")
console.log(wiccPrivateKey)

var privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey)
//console.log("get private key:")
//console.log(privateKey)
var address = privateKey.toAddress();
console.log("get address:")
console.log(address.toString())

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.DELEGATE_TX, regAppInfo)
console.log("contract tx raw: ")
console.log(rawtx)
