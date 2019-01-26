'use strict';

// usage: node test-registerapptx.js

var bitcore = require('..');
var buffer = require('buffer');
var scrypt = require('scryptsy')
var aesjs = require("aes-js")
var fs = require("fs")

//var privateKey = new bitcore.PrivateKey(null, 'testnet');
var privateKey = bitcore.PrivateKey.fromWIF('Y8JhshTg5j2jeTrwk3qBJDYGi5MVsAvfBJRgFfAp14T91UY9AHgZ')
var address = privateKey.toAddress();
var publicKey = privateKey.toPublicKey();

var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

var script = fs.readFileSync(__dirname + '/data/contract-hello.lua');
//console.log("load script file:")
//console.log(script);


//note: change "nValidHeight" to current valid height, so that you can execute “submittx” ok after get the result
var regAppInfo = {
    nTxType: bitcore.WiccApi.REG_APP_TX,
    nVersion: 1,
    nValidHeight: 24560,
    regAcctId: "22030-2",
    script: script,
    scriptDesc: "",
    fees: 110000000,
  };

/*  
{
    "hash" : "dd4da1cd31f6d6eb8f81c067f5ac35c2f7334c47713f09670be5b5c9fd9887c2",
    "txtype" : "REG_APP_TX",
    "ver" : 1,
    "regid" : "22030-2",
    "addr" : "waFdYrQfDSsh1jVsDzPiutAPUKCHZJ4Wyp",
    "script" : "script_content",
    "fees" : 110000000,
    "height" : 22039,
    "blockhash" : "d0e6be692161da4367d25258c535d4cd8a2969f4642b018e9c2939dce21ad6b5",
    "confirmHeight" : 22041,
    "confirmedtime" : 1548295400,
    "rawtx" : "050180ab170480ab0e02fd4704fd43046d796c6962203d207265717569726520226d796c6962220a2d2de8849ae69cace4b8ade5bf85e9a1bbe4bba5606d796c6962203d207265717569726520226d796c69622260e5bc80e5a4b4efbc8ce6b3a8e6848fe4b880e5ae9ae8a681e694bee59ca8e7acace4b880e8a18cefbc8ce7acace4b880e8a18ce5a682e69e9ce79599e7a9bae4bc9ae68aa5e5bc82e5b8b8e380820a0a2d2de5ae9ae4b989e59088e7baa6e8b083e794a8e4ba8be4bbb60a4d4554484f44203d207b0a20202020434845434b5f48454c4c4f574f524c4420203d20307831372c0a2020202053454e445f48454c4c4f574f524c44203d20307831380a7d0a0a2d2de58f82e880835b342e3320415049e8b083e8af95e696b9e6b395e5ae9ee4be8b5d0a2d2de794a8e4ba8ee8be93e587ba6c6f67e4bfa1e681afe887b3e69687e4bbb60a4c6f674d7367203d2066756e6374696f6e20286d7367290a2020206c6f63616c206c6f675461626c65203d207b0a20202020202020206b6579203d20302c0a20202020202020206c656e677468203d20737472696e672e6c656e286d7367292c0a202020202020202076616c7565203d206d73670a20207d0a20206d796c69622e4c6f675072696e74286c6f675461626c65290a656e640a0a2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d0a0a436865636b203d2066756e6374696f6e28290a202020204c6f674d7367282252756e20434845434b5f48454c4c4f574f524c44204d6574686f6422290a656e640a0a53656e64203d2066756e6374696f6e28290a202020204c6f674d7367282252756e2053454e445f48454c4c4f574f524c44204d6574686f6422290a656e640a0a2d2de58f82e880835b342e32e5bc80e58f91e5b8b8e794a8e696b9e6b3955d0a2d2de699bae883bde59088e7baa6e585a5e58fa30a4d61696e203d2066756e6374696f6e28290a20206173736572742823636f6e7472616374203e3d322c2022506172616d206c656e677468206572726f7220283c32293a2022202e2e23636f6e747261637420290a202061737365727428636f6e74726163745b315d203d3d20307866302c2022506172616d204d616769634e6f206572726f7220287e3d30786630293a2022202e2e20636f6e74726163745b315d290a0a2020696620636f6e74726163745b325d203d3d204d4554484f442e434845434b5f48454c4c4f574f524c44207468656e0a20202020436865636b28290a2020656c7365696620636f6e74726163745b325d203d3d204d4554484f442e53454e445f48454c4c4f574f524c44207468656e0a2020202053656e6428290a2020656c73650a202020206572726f7228276d6574686f642320272e2e737472696e672e666f726d6174282225303278222c20636f6e74726163745b325d292e2e27206e6f7420666f756e6427290a2020656e640a656e640a0a4d61696e28290a0a00b3b8ee00473045022100af11d737ae539981bfaeeba0bd6da07ef5da258b68d09c3df2bc8bf4aaec16f1022050e9279b481b3747a203126ccef08959448e9d8acacc0695f8f4792f91acac5a"
}

*/

var wicc_private_key='Y9f6JFRnYkHMPuEhymC15wHD9FbYBmeV2S6VfDicb4ghNhtXhgAJ'
//var addr='waFdYrQfDSsh1jVsDzPiutAPUKCHZJ4Wyp'

//var strMne = wiccApi.createAllCoinMnemonicCode()
//console.log("new mnemonic code:")
//console.log(strMne)

//var walletinfo = wiccApi.createWallet(strMne, '12345678')
//console.log("new wallet info:")
//console.log(walletinfo)


//var wiccPrivateKey = wiccApi.getPriKeyFromSeed(walletinfo.seedinfo, '12345678')
var wiccPrivateKey = wicc_private_key
console.log("wicc private key:")
console.log(wiccPrivateKey)

var privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey)
console.log("get private key:")
console.log(privateKey)
var address = privateKey.toAddress();
console.log("get address:")
console.log(address.toString())

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.REG_APP_TX, regAppInfo)
console.log("reg app tx raw: ")
console.log(rawtx)