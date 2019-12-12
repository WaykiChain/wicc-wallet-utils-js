'use strict';

var { WaykiTransaction, Wallet, BaasClient } = require("../index");
var wallet = new Wallet("Y9nSdtBMWzWnEzx3TCgZ2iR8n4mq33AgkwbuoFT8VUWjDrcYjfgD");
var baasClient = new BaasClient("https://baas-test.wiccdev.org/v2/api")

;(async () => {
  var heightResponse = await baasClient.getBlockCount()
  var regIdResponse = await baasClient.getAccountInfo(wallet.address)
  
  var assetData = {
    assetSymbol: "STOKENN",   //asset Symbol Capital letter A-Z 6-7 digits [A_Z]
    ownerRegid: "0-1",  //asset owner
    assetName: "SS Token",  //asset token name
    totalSupply: 10000000000000000,// total Supply *10^8
    modifiAble: false    //Whether to increase the number
  }

  //note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
  var assetCreateInfo = {
    nTxType: 9,
    nValidHeight: heightResponse.data, // create height
    srcRegId: regIdResponse.data.regid, // sender's regId
    asset: assetData,
    feeSymbol: "WICC",
    fees: 55001000000, // fees pay for miner min 0.01 wicc  +550wicc
  };

  var transaction = new WaykiTransaction(assetCreateInfo, wallet)
  var rawtx = transaction.genRawTx()
  console.log("asset create tx raw: ")
  console.log(rawtx)
  console.log(" Broadcast transaction signature data to blockchain => ")
  baasClient.sendRawTx(rawtx).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
})()