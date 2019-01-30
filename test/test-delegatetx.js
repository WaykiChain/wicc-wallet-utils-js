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
    publicKey: Buffer.from("02e5ee9bd73c561fc9844fc3065c87d297f6ba52f64f409346a4bb5035f2de25ab", 'hex'),
    votes: 2000001
  },
  {
    // address: 'wQsRcb6VcSr9DnpaLiWwrSA6YPuaUMbbYw'
    publicKey: Buffer.from("03b05d123a496430f321e8f6ef7d4419c39fd3745f0aa60c0d9b54adcfff1e7ab4", 'hex'),
    votes: 2000002
  },
]

//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var regAppInfo = {
  nTxType: bitcore.WiccApi.DELEGATE_TX,
  nVersion: 1,
  nValidHeight: 53890, // create height
  srcRegId: "44483-1", // sender's regId
  delegateData: delegateData,
  fees: 1001, // fees pay for miner
};

var wiccPrivateKey = 'Y7Mn3ieAgweoaTfkH3Y3LKsD6BNAwbKVM42SERFycA22uufVMNfj'
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
