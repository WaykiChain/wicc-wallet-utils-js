'use strict';
console.error('\n=====RUN-TEST-WICCAPI-START=====\n')
var  { WiccApi } = require("../index")

//environment init 
//环境初始化
var arg = {network: 'testnet'}
var wiccApi = new WiccApi(arg)

//Create Mnemonic Code
//创建助记词
var strMne = wiccApi.createAllCoinMnemonicCode()
console.log('New MnemonicCode='+ strMne)

var switchCode = wiccApi.switchMnemonicCode(strMne, "CHINESE")
console.log("switchCode=", switchCode)
//Check if the mnemonic is valid
//检查助记词是否有效
var ret = wiccApi.checkMnemonicCode(strMne)
console.log('Check MnemonicCode Result=' + ret)

//Get WIF privatekey from mnemoniccode
//根据助记词获取对应的WIF格式私钥
var privateKey1 = wiccApi.getPriKeyFromMnemonicCode(strMne)
console.log('privateKey1='+privateKey1)

var privateKey3 = wiccApi.getPriKeyFromMnemonicCode(switchCode)
console.log('privateKey3='+privateKey3)

//Create a wallet based on the mnemonic, '12345678' is the wallet password
//根据助记词创建钱包,'12345678'为钱包密码
var walletInfo = wiccApi.createWallet(strMne, '12345678')
console.log('walletInfo=')
console.log(walletInfo)

//Get WIF privatekey from wallet
//根据钱包种子获取对应的WIF格式私钥
var privateKey2 = wiccApi.getPriKeyFromSeed(walletInfo.seedinfo, '12345678')
console.log('privateKey2='+privateKey2)

//Get mnemonics based on wallet seeds
//根据钱包种子获取助记词
var Mne = wiccApi.getMnemonicCodeFromSeed(walletInfo.seedinfo, '12345678')
console.log("Get MnemonicCode from wallet seed="+Mne)

//Get an address based on the WIF format private key. Note: privateKey2 and privateKey1 are equal.
//根据WIF格式私钥获取地址 ,注意：privateKey2 和 privateKey1 是一样的
var privateKey = WiccApi.PrivateKey.fromWIF(privateKey2)
var pubKey=privateKey.toPublicKey();
var address = privateKey.toAddress();
console.log("New Create publicKey1="+pubKey,"New Create address="+address.toString())

//Check if the address is valid
//检查地址是否有效
ret = wiccApi.validateAddress(address)
console.log("Check address Result="+ret)

console.error('\n=====RUN-TEST-WICCAPI-END=====\n')
