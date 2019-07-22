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
var dexDealItems = [ // array,  item is object data of delegate
    {
        buyOrderId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
        sellOrderId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
        dealPrice: 20000000,
        dealCoinAmount: 1000000000,
        dealAssetAmount: 10000000000
    },
    {
        buyOrderId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
        sellOrderId: "009c0e665acdd9e8ae754f9a51337b85bb8996980a93d6175b61edccd3cdc144",
        dealPrice: 20000000,
        dealCoinAmount: 1000000000,
        dealAssetAmount: 10000000000
    }
]

//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var dexSettletxInfo = {
    nTxType: bitcore.WiccApi.DEX_SETTLE_TX,
    nVersion: 1,
    nValidHeight: 28128, // create height
    srcRegId: "28121-3", // sender's regId
    fees: 100000,
    dexDealItems: dexDealItems,
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

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.DEX_SETTLE_TX, dexSettletxInfo)
console.log("contract tx raw: ")
console.log(rawtx)
