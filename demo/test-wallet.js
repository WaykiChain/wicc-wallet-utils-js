var { Wallet } = require("../index")

var privKey = "Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13"
var wallet = new Wallet(privKey)

console.log(wallet)

var msg = "WaykiChain"
var signMsg = wallet.signMessage(msg)
console.log("签名消息:"+signMsg)

var pubKey = wallet.publicKeyAsHex()
console.log("公钥:"+pubKey)