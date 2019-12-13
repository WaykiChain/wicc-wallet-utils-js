# wicc-wallet-utils-js v2.0
Official JavaScript library that provides WICC Offline Wallet capabilities

# Installation
### CDN
```html
<script src="cnd_url"></script>
```
### NPM
```
npm install wicc-wallet-lib
```
# Usage
```javascript
const { Wallet, WalletManager, WaykiTransaction, BaasClient } = require("wicc-wallet-lib")
```
## Key Classes
### Wallet —— Constructor of a blockchain wallet
[Demo](demo/test-wallet.js)
```javascript
const privKeyWIF = "Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13"
const wallet = new Wallet(privKeyWIF) 
//{privateKey: 'Y6J4aK6Wcs4A3Ex4HXdfjJ6ZsHpNZfjaS4B9w7xqEnmFEYMqQd13', address: 'wLKf2NqwtHk3BfzK5wMDfbKYN1SC3weyR4' }
```
#### Instance Methods
- **signMessage**

    Message signature method

```javascript
const msg = "wicc test"
const signTx = wallet.signMessage(msg) 
```
- **publicKeyAsHex**

    Get wallet public key

```javascript
const pubKey = wallet.publicKeyAsHex()
```

### WalletManager —— Constructor of wallet management
[Demo](demo/test-walletmanager.js)
```javascript
const networkType = "testnet"
var walletManager = new WalletManager(networkType)
```
#### Instance Methods
- **randomMnemonicCodes**

    Generate a mnemonic randomly
```javascript
const lang = "ENGLISH" // or CHINESE
const mnemonics = walletManager.randomMnemonicCodes(lang) 
//mnemonics = "clinic dose kingdom fetch away industry squirrel cheese purchase mean slide mixed"
```
- **createWallet**

    Create a blockchain wallet from valid mnemonics, returns a instance object of **Wallet**
```javascript
var wallet = walletManager.createWallet(mnemonics)
```
- **importWalletFromMnemonic**

    Import an existing wallet from its mnemonics 
```javascript
var wallet = walletManager.importWalletFromMnemonic(mnemonics)
```
- **importWalletFromPrivateKey**

    Import an existing wallet from its private key 
```javascript
var wallet = walletManager.importWalletFromPrivateKey(privateKeyWIF)
```

### WaykiTransaction —— Constructor of transaction signature 
```javascript
var wallet = new Wallet(privKeyWIF) 
var txParams = {
  nTxType: 15, // transaction type
  nValidHeight: 34400,    // create height
  srcRegId: '0-1',    // sender's regId
  appId: "24555-1",  // app regId
  feeSymbol: "WICC",
  coinSymbol: "WUSD",
  fees: 1000000,         // fees pay for miner
  amount: 8,              // amount of WICC to be sent to the app account
  vContract: "f018"      // contract method, hex format string
};
var transaction = new WaykiTransaction(txParams, wallet)
```

#### Instance Methods
- **genRawTx**
```javascript
var rawTx = transaction.genRawTx()
```
### List of all transactions
| Transaction type  | nTxType  | Demo |
| :------------ |:---------------:| -----:|
| ACCOUNT_REGISTER_TX      | 2 | [test-registeraccounttx.js](demo/test-registeraccounttx.js) |
| BCOIN_TRANSFER_TX      | 3 | [test-commontx.js](demo/test-commontx.js) |
| LCONTRACT_INVOKE_TX      | 4 | [test-callcontracttx.js](demo/test-callcontracttx.js) |
| LCONTRACT_DEPLOY_TX      | 5 | [test-registercontracttx.js](demo/test-registercontracttx.js) |
| DELEGATE_VOTE_TX      | 6 | [test-delegatetx.js](demo/test-delegatetx.js) |
| ASSET_ISSUE_TX      | 9 | [test-assetcreatetx.js](demo/test-assetcreatetx.js) |
| ASSET_UPDATE_TX      | 10 | [test-assetupdatetx.js](demo/test-assetupdatetx.js) |
| UCOIN_TRANSFER_TX      | 11 | [test-ucointransfertx.js](demo/test-ucointransfertx.js) |
| UCOIN_CONTRACT_INVOKE_TX      | 15 | [test-ucontractinvoketx.js](demo/test-ucontractinvoketx.js) |
| CDP_STAKE_TX      | 21 | [test-cdpstaketx.js](demo/test-cdpstaketx.js) |
| CDP_REDEEMP_TX      | 22 | [test-cdpredeemtx.js](demo/test-cdpredeemtx.js) |
| CDP_LIQUIDATE_TX      | 23 | [test-cdpliquidatetx.js](demo/test-cdpliquidatetx.js) |
| DEX_LIMIT_BUY_ORDER_TX      | 84 | [test-dexbuylimitordertx.js](demo/test-dexbuylimitordertx.js) |
| DEX_LIMIT_SELL_ORDER_TX      | 85 | [test-dexselllimitordertx.js](demo/test-dexselllimitordertx.js) |
| DEX_MARKET_BUY_ORDER_TX      | 86 | [test-dexbuymarketordertx.js](demo/test-dexbuymarketordertx.js) |
| DEX_MARKET_SELL_ORDER_TX      | 87 | [test-dexsellmarketordertx.js](demo/test-dexsellmarketordertx.js) |
| DEX_CANCEL_ORDER_TX      | 88 | [test-dexcancelordertx.js](demo/test-dexcancelordertx.js) |

### BaasClient —— Contains some of Baas (Blockchain as a Service) API; HTTP requerts
[Demo](demo/test-baasclient.js)
```javascript
var baasClient = new BaasClient(BaasUrl)
```

| BaasNetwork  | BaasUrl  | Remarks |
| :------------ |:---------------:| -----:|
| TestNetwork      | https://baas-test.wiccdev.org/v2/api | [documentation](https://baas-test.wiccdev.org/v2/api/swagger-ui.html#!/) |
| ProdNetwork     | https://baas.wiccdev.org/v2/api        |   [documentation](https://baas.wiccdev.org/v2/api/swagger-ui.html#!/) |

#### Instance Methods
- **getAccountInfo**

    Get information of a specific wallet address, returns a Promise
```javascript
const address = "whiRBzMprDzY5wq3oPsHvAnyDV8ggYNaZE"
const response = baasClient.getAccountInfo(address)
response.then(data => {
    console.log(data)
})
```
- **getBlockCount**

    Get the current block height, returns a Promise
```javascript
const response = baasClient.getBlockCount()
response.then(data => {
    console.log(data)
})
```
- **sendRawTx**

    Broadcast transaction signature data to blockchain, returns a Promise
```javascript
const rawTx = "0301818c760200011476c6077b5679c8ef47f4243ca25537d5c3f7fad883e1ac009f80e7eeef000d74657374207472616e73666572473045022100e2853b6dfb8a892659de4a43181f8a02e983cca319def2457ea7b0a14c8966ea0220733ce86e172bff8aba750d104b6f39b737c897df7c33413142bd13b2415ce2f2"
const response = baasClient.sendRawTx(rawTx)
response.then(data => {
    console.log(data)
})
```
- **decodeRawTx**

    Get the original transaction detail based on the signature data, returns a Promise
```javascript
const rawTx = "0301818c760200011476c6077b5679c8ef47f4243ca25537d5c3f7fad883e1ac009f80e7eeef000d74657374207472616e73666572473045022100e2853b6dfb8a892659de4a43181f8a02e983cca319def2457ea7b0a14c8966ea0220733ce86e172bff8aba750d104b6f39b737c897df7c33413142bd13b2415ce2f2"
const response = baasClient.decodeRawTx(rawTx)
response.then(data => {
    console.log(data)
})
```

# Development & Tests

```sh
$ git clone https://github.com/WaykiChain/wicc-wallet-utils-js.git
$ cd wicc-wallet-utils-js
$ npm install
```

### Build (you will get a UMD module):
- Execution Command
```sh
$ npm run build 
```
- Output
```
dist/wicc-wallet-lib-2.0.js
```
## Examples

Run all the Demos:

```sh
$ npm run test
```
# Reference Projects
[bitpay/bitcore-lib](https://github.com/bitpay/bitcore-lib)

# Contact us
To get community assistance and ask for help with implementation questions

* Telegram group: https://t.me/waykichaindeveng
* Wechat ID: wjlT2D2

# License

Code released under [the MIT license](https://github.com/WaykiChain/wicc-wallet-utils-js/blob/master/LICENSE).

&copy; 2017-present WaykiChain, Inc. 