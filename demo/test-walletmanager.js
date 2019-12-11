console.error('\n=====RUN-TEST-WALLETMANAGER-START=====\n')

var { WalletManager } = require("../index")

var walletManager = new WalletManager("testnet")

//创建助记词
var mnemonic = walletManager.randomMnemonicCodes("ENGLISH")
console.log("助记词：", mnemonic)

//创建钱包
var walletInfo = walletManager.createWallet('romance chunk tape soon bitter option wet space veteran matter embrace cactus')
console.log("助记词：", walletInfo)

//导入助记词
var wallet1 = walletManager.importWalletFromMnemonic('romance chunk tape soon bitter option wet space veteran matter embrace cactus')
console.log("wallet1:", wallet1)

//导入私钥
var wallet2 = walletManager.importWalletFromPrivateKey('Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13')
console.log("wallet2:", wallet2)

console.error('\n=====RUN-TEST-WALLETMANAGER-END=====\n')