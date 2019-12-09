var PrivateKey = require('../src/lib/privatekey');

var transactionParams = function (arg, wallet) {
    let txParams = {}
    txParams.nVersion = 1
    txParams.nTxType = arg.nTxType

    var txParamsHandlerMap = {
        2: {
            name: 'ACCOUNT_REGISTER_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.pubkey = pubkey
                txParams.minerPubkey = ""
                txParams = Object.assign(txParams, arg)
            }
        },
        3: {
            name: 'BCOIN_TRANSFER_TX',
            handler: () => { 
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.srcRegId = arg.srcRegId
                txParams.destAddr = arg.destAddr
                txParams.value = arg.amount
                txParams.memo = arg.memo
                txParams.pubkey = pubkey
            }
        },
        4: {
            name: 'CONTRACT_TX',
            handler: () => { }
        },
        5: {
            name: 'REG_APP_TX',
            handler: () => { }
        },
        6: {
            name: 'DELEGATE_TX',
            handler: () => { }
        },
        8: {
            name: 'FCOIN_STAKE_TX',
            handler: () => { }
        },
        9: {
            name: 'ASSET_ISUUE',
            handler: () => { }
        },
        10: {
            name: 'ASSET_UPDATE',
            handler: () => { }
        },

        11: {
            name: 'UCOIN_TRANSFER_TX',
            handler: () => { }
        },
        15: {
            name: 'UCOIN_CONTRACT_INVOKE_TX',
            handler: () => { }
        },
        21: {
            name: 'CDP_STAKE_TX',
            handler: () => { }
        },
        22: {
            name: 'CDP_REDEEMP_TX',
            handler: () => { }
        },
        23: {
            name: 'CDP_LIQUIDATE_TX',
            handler: () => { }
        },
        84: {
            name: 'DEX_BUY_LIMIT_ORDER_TX',
            handler: () => { }
        },
        85: {
            name: 'DEX_SELL_LIMIT_ORDER_TX',
            handler: () => { }
        },
        86: {
            name: 'DEX_BUY_MARKET_ORDER_TX',
            handler: () => { }
        },
        87: {
            name: 'DEX_SELL_MARKET_ORDER_TX',
            handler: () => { }
        },
        88: {
            name: 'DEX_CANCEL_ORDER_TX',
            handler: () => { }
        }
    }

    txParamsHandlerMap[txParams.nTxType].handler()

    return txParams
}

module.exports = transactionParams