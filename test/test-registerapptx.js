'use strict';

// usage: 
// node test-registerapptx.js

var _ = require('lodash');
var bitcore = require('..');
var fs = require("fs")

var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

var script = fs.readFileSync(__dirname + '/data/contract-hello.lua');
//console.log("load script file:")
//console.log(script);

console.log(_.isString(script))
console.log(_.isArray(script))
console.log(_.isArrayBuffer(script))
console.log(_.isBuffer(script))

//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var regAppInfo = {
    nTxType: bitcore.WiccApi.REG_APP_TX,
    nVersion: 1,
    nValidHeight: 34400,       // create height
    regAcctId: "22030-2",      // sender's regId
    script: script,            // contract scrypt content, string or buf
    scriptDesc: "",            // contract scrypt description, string or buf
    fees: 110000000,           // fees pay for miner
  };

var wiccPrivateKey = 'Y9f6JFRnYkHMPuEhymC15wHD9FbYBmeV2S6VfDicb4ghNhtXhgAJ'
console.log("wicc private key:")
console.log(wiccPrivateKey)

var privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey)
//console.log("get private key:")
//console.log(privateKey)
var address = privateKey.toAddress();
console.log("get address:")
console.log(address.toString())

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.REG_APP_TX, regAppInfo)
console.log("reg app tx raw: ")
console.log(rawtx)