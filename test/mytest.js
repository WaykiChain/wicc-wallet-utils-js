'use strict';

var bitcore = require('..');
var buffer = require('buffer');
var scrypt = require('scryptsy')
var aesjs = require("aes-js")
//var privateKey = new bitcore.PrivateKey(null, 'testnet');
var privateKey = bitcore.PrivateKey.fromWIF('Y8JhshTg5j2jeTrwk3qBJDYGi5MVsAvfBJRgFfAp14T91UY9AHgZ')
var address = privateKey.toAddress();
var publicKey = privateKey.toPublicKey();

/*
var info = {
    nTxType: 2,
    nVersion: 1,
    nValidHeight: 601606,
    fees: 10000,
    pubkey: '02ab72cfecc7055501b397e1150b3dc528f2fd5647241924824a5afc0b5a818221',
    minerPubkey: ''
  };

var register = new bitcore.Transaction.RegisterAccountTx(info);
console.log(register.pubkey)
var ret = register._SignatureHash()
console.log(ret.toString('hex'))

register._Signtx(privateKey);

console.log(address.toString())
console.log(privateKey.toWIF())
console.log(publicKey.toString())

var buf = buffer.Buffer.from('123')
console.log(buf.length)

var hex = register.SerializeTx(privateKey)
console.log(hex)
*/

/*
var commonTxinfo = {
    nTxType: 3,
    nVersion: 1,
    nValidHeight: 602371,
    fees: 10000,
    srcRegId: '54528-1',
    destAddr: 'wh82HNEDZkZP2eVAS5t7dDxmJWqyx9gr65',
    value: 10000000000,
    network: 'testnet'
  };

  var value = 10000000000
  var tmp = (value >>> 7)

  var commonTx = new bitcore.Transaction.CommonTx(commonTxinfo);
  console.log(commonTx.destAddr)

  var ret = commonTx._SignatureHash()
  console.log(ret.toString('hex'))

  commonTx._Signtx(privateKey);

  var hex = commonTx.SerializeTx(privateKey)
  console.log(hex)
*/

//var contract = bitcore.util.util.getSpcContractData('wUCVEiaEzNvWMo9B1gwQ4Us8oNz8T1zZVn', 100000000)

/*
var iteminfo1 = {
    playType:1,
    betType:1,
    times: 1,
    money: 200000000
}

var item1 = new bitcore.util.BetItem(iteminfo1)

var itemList = []
itemList.push(item1)

var iteminfo2 = {
    playType:2,
    betType:1,
    times: 1,
    money: 200000000
}

var item2 = new bitcore.util.BetItem(iteminfo2)
itemList.push(item2)

console.log(itemList.length)
console.log(typeof(itemList))
console.log(itemList instanceof Array);   

var contract = bitcore.util.util.getBetContractData('397FB303-393A-4C10-9142-B1FDCD80B722', 'wUCVEiaEzNvWMo9B1gwQ4Us8oNz8T1zZVn', 1, itemList)

var contractTxinfo = {
    nTxType: 4,
    nVersion: 1,
    nValidHeight: 602623,
    srcRegId: '54528-1',
    destRegId: '418581-2',
    fees: 1000000,
    value: 0,
    vContract: contract
  };

  var contractTx = new bitcore.Transaction.ContractTx(contractTxinfo);
  console.log(contractTx.vContract.toString('hex'))

  var ret = contractTx._SignatureHash()
  console.log(ret.toString('hex'))

  contractTx._Signtx(privateKey);

  var hex = contractTx.SerializeTx(privateKey)
  console.log(hex)
 
*/

/*
var votefund1 = {
    operType: bitcore.util.VoteFund.ADD_FUND,
    pubkey: '0210a1a5ad1b00492fcd241905e361c80f7bb641361ef219350018e3205ca322f7',
    value: 100000000
}

var item1 = new bitcore.util.VoteFund(votefund1)
var itemList = []
itemList.push(item1)

var votefund2 = {
    operType: bitcore.util.VoteFund.ADD_FUND,
    pubkey: '03d1ed364d09d95605a173f8fea3fac84ae73fdb87e52ff4d7c837f16a9ba6b1e6',
    value: 200000000
}

var item2 = new bitcore.util.VoteFund(votefund2)
itemList.push(item2)

var delegateData = bitcore.util.util.getDelegateData(itemList)
console.log(delegateData.toString('hex'))

var delegateTxinfo = {
    nTxType: 6,
    nVersion: 1,
    nValidHeight: 770746,
    srcRegId: '54528-1',
    delegateData: delegateData,
    fees: 1000000
  };

  var delegateTx = new bitcore.Transaction.DelegateTx(delegateTxinfo);
  console.log(delegateTx.delegateData.toString('hex'))

  var ret = delegateTx._SignatureHash()
  console.log(ret.toString('hex'))

  delegateTx._Signtx(privateKey);

  var hex = delegateTx.SerializeTx(privateKey)
  console.log(hex)


var code = new bitcore.Mnemonic(bitcore.Mnemonic.Words.ENGLISH);
console.log(code.toString()); // natal hada sutil año sólido papel jamón combate aula flota ver esfera...
var xpriv = code.toHDPrivateKey(null, 'livenet');
console.log(xpriv.toString())
var seed = code.toSeed()
console.log(seed.toString('hex'))

var password = "pleaseletmein"
var salt = "SodiumChloride"
var data = scrypt(password, salt, 16384, 8, 1, 64)
console.log(data.toString('hex'))
*/
//var arg = {network: 'livenet'}
var arg = {network: 'testnet'}
var wiccApi = new bitcore.WiccApi(arg)

var strMne = wiccApi.createAllCoinMnemonicCode()
console.log(strMne)

var ret = wiccApi.checkMnemonicCode(strMne)
console.log(ret)

ret = wiccApi.validateAddress('wPcHigM3Gbtbooxyd3YyBXiMintZnfD7cE')
console.log(ret)

var reginfo = {
    nTxType: 2,
    nVersion: 1,
    nValidHeight: 601606,
    fees: 10000,
    pubkey: publicKey.toString(),
    minerPubkey: ''
  };

var rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.REGISTER_ACCOUNT_TX, reginfo)
console.log("test createSignTrasaction: ")
console.log(rawtx)

var walletinfo = wiccApi.createWallet(strMne, '12345678')
console.log(walletinfo)


var pri = wiccApi.getPriKeyFromSeed(walletinfo.seedinfo, '12345678')
console.log("test getPriKeyFromSeed:")
console.log(pri)

var privateKey = bitcore.PrivateKey.fromWIF(pri)
var address = privateKey.toAddress();
console.log(address.toString())

var Mne = wiccApi.getMnemonicCodeFromSeed(walletinfo.seedinfo, '12345678')
console.log(Mne)

var newSeedInfo = wiccApi.changePassword(walletinfo.seedinfo, '12345678', '87654321')
console.log(newSeedInfo)

pri = wiccApi.getPriKeyFromSeed(newSeedInfo, '87654321')
console.log(pri)