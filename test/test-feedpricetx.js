'use strict';

// usage: node test-contracttx.js

var bitcore = require('..');
var WriterHelper = require('../lib/util/writerhelper')
var arg = {
  network: 'testnet'
}
var wiccApi = new bitcore.WiccApi(arg)

/*
publicKey can get from "getaccountinfo" cmd if the account have registered
*/
var feedPriceData = [ // array,  item is object data of delegate
  {
    coinPriceType: {
      coinType:WriterHelper.prototype.CoinType.WICC,
      priceType:WriterHelper.prototype.PriceType.KWH
    },
    price: 200000
  }
]

//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var regAppInfo = {
  nTxType: bitcore.WiccApi.PRICE_FEED_TX,
  nVersion: 1,
  nValidHeight: 28128, // create height
  srcRegId: "28121-3", // sender's regId
  feedPriceData: feedPriceData,
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

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.PRICE_FEED_TX, regAppInfo)
console.log("contract tx raw: ")
console.log(rawtx)
