# wicc-wallet-utils-js
Official JavaScript library that provides WICC Offline Wallet capabilities

## Key Functions
### Generate mnemonic phrase, private-public key pair and WICC addresses for mainnet/testnet
[Example](./test/test-wallet.js)
### Offline sign registration transaction for newly created WICC addresses
[Example](./test/test-registeraccounttx.js)
### Offline sign WICC coin transfer transactions
[Example](./test/test-commontx.js)
### Offline sign contract Lua Script deployment transactions
[Example](./test/test-registercontractjs.js)
### Offline sign contract calling transactions
[Example](./test/test-callcontracttx.js)
### Offline sign delegate vote transactions
[Example](./test/test-delegatetx.js)

## Get Started

```
npm install wicc-wallet-lib
```

```
bower install wicc-wallet-lib
```

## Contact us
To get community assistance and ask for help with implementation questions

* Telegram group: https://t.me/waykichaindeveng
* Wechat ID: wjlT2D2

## Development & Tests

```sh
git clone https://github.com/WaykiChain/wicc-wallet-utils-js.git
cd wicc-wallet-utils-js
npm install
```

Run all the tests:

```sh
gulp test
```

You can also run just the Node.js tests with `gulp test:node`, just the browser tests with `gulp test:browser`
or create a test coverage report (you can open `coverage/lcov-report/index.html` to visualize it) with `gulp coverage`.

## License

Code released under [the MIT license](https://github.com/WaykiChain/wicc-wallet-utils-js/blob/master/LICENSE).

Copyright 2017-2019 WaykiChain, Inc. 
