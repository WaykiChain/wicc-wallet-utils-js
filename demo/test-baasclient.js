console.error('\n=====RUN-TEST-BAASCLIENT-START=====\n')

var { WaykiTransaction, WalletManager, BaasClient } = require("../index")

var wallet = new WalletManager("testnet").importWalletFromPrivateKey("Y8AvAr4cajNnYfzVU9gAzNuQ8rYWJ5Dq5XyTkczeb9mNmGxEKWua")
console.log('wallet:')
console.log(wallet)

var baasClinet = new BaasClient("https://baas-test.wiccdev.org/v2/api")

// get account information
var response = baasClinet.getAccountInfo(wallet.address) //returns a Promise

// get blcok count
var countResponse = baasClinet.getBlockCount() //returns a Promise

Promise.all([response, countResponse]).then(res => {
    console.log("account info:")
    console.log(res[0].data)
    console.log("block count:")
    console.log(res[1].data)

    // broadcast transaction signature data to blockchain
    var txParams = {
        nTxType: 3,
        nValidHeight: res[1].data,
        fees: 10000000,
        srcRegId: res[0].data.regid,
        destAddr: 'wWTStcDL4gma6kPziyHhFGAP6xUzKpA5if',
        amount: 100000000,
        memo: "test transfer"
    };
    console.log(txParams)
    var transaction = new WaykiTransaction(txParams, wallet)
    var rawTx = transaction.genRawTx()

    console.log(rawTx)

    baasClinet.sendRawTx(rawTx).then(res => {
        console.log("success-hash:")
        console.log(res.data.hash)
    })
})

console.error('\n=====RUN-TEST-BAASCLIENT-END=====\n')