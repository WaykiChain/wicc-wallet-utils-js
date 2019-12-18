console.error('\n=====RUN-TEST-WALLETMANAGER-START=====\n')

var { WalletManager } = require("../index")

var walletManager = new WalletManager("testnet")

//创建助记词
var mnemonic = walletManager.randomMnemonicCodes("ENGLISH")
console.log("助记词：", mnemonic)

//切换成中文助记词
var chineseMnemonic = walletManager.switchMnemonicCodes(mnemonic, "CHINESE")
console.log("中文助记词：", chineseMnemonic)

//创建钱包
var walletInfo = walletManager.createWallet(mnemonic)
console.log("钱包1：\n", walletInfo)

var walletInfo2 = walletManager.createWallet(chineseMnemonic)
console.log("钱包2：\n", walletInfo2)

//导入助记词
var wallet1 = walletManager.importWalletFromMnemonic('romance chunk tape soon bitter option wet space veteran matter embrace cactus')
var wallet3 = walletManager.importWalletFromMnemonic(walletManager.switchMnemonicCodes('romance chunk tape soon bitter option wet space veteran matter embrace cactus', "CHINESE"))
console.log("wallet1:", wallet1)
console.log("wallet3:", wallet3)

//导入私钥
var wallet2 = walletManager.importWalletFromPrivateKey('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')
console.log("wallet2:", wallet2)

console.error('\n=====RUN-TEST-WALLETMANAGER-END=====\n')