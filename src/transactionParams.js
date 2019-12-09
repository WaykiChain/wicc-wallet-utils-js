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
            name: 'LCONTRACT_INVOKE_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.nValidHeight = arg.nValidHeight
                txParams.srcRegId = arg.srcRegId
                txParams.destRegId = arg.appId
                txParams.fees = arg.fees
                txParams.value = arg.amount
                txParams.vContract = arg.vContract
                txParams.publicKey = pubkey
            }
        },
        5: {
            name: 'LCONTRACT_DEPLOY_TX',
            handler: () => {
                txParams.nValidHeight = arg.nValidHeight
                txParams.regAcctId = arg.srcRegId
                txParams.script = arg.vContract
                txParams.scriptDesc = arg.description
                txParams.fees = arg.fees
            }
        },
        6: {
            name: 'DELEGATE_VOTE_TX',
            handler: () => {
                let list = []
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.nValidHeight = arg.nValidHeight
                txParams.srcRegId = arg.userId
                txParams.fees = arg.fees
                txParams.publicKey = pubkey
                arg.voteLists.map(item => {
                    list.push({
                        publicKey: item.srcRegId,
                        votes: item.voteValue
                    })
                })
                txParams.delegateData = list.slice()
            }
        },
        9: {
            name: 'ASSET_ISSUE_TX',
            handler: () => {
                txParams.nValidHeight = arg.nValidHeight
                txParams.srcRegId = arg.srcRegId
                txParams.assetData = arg.asset
                txParams.feesCoinSymbol = arg.feeSymbol
                txParams.fees = arg.fees
            }
        },
        10: {
            name: 'ASSET_UPDATE_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.srcRegId = arg.srcRegId
                txParams.assetUpdateData = arg.updateData
                txParams.feesCoinSymbol = arg.feeSymbol
                txParams.assetSymbol = arg.assetSymbol
                txParams.fees = arg.fees
            }
        },

        11: {
            name: 'UCOIN_TRANSFER_TX',
            handler: () => {
                let list = []
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.srcRegId = arg.srcRegId
                txParams.memo = arg.memo
                txParams.feesCoinType = arg.feeSymbol
                arg.dests.map(item => {
                    list.push({
                        coinType: item.coinSymbol,
                        destAddr: item.destAddress,
                        value: item.transferAmount
                    })
                })
                txParams.destArr = list.slice()
            }
        },
        15: {
            name: 'UCOIN_CONTRACT_INVOKE_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.srcRegId = arg.srcRegId
                txParams.destRegId = arg.appId
                txParams.feesCoinType = arg.feeSymbol
                txParams.coinType = arg.coinSymbol
                txParams.fees = arg.fees
                txParams.value = arg.amount
                txParams.vContract = arg.vContract
            }
        },
        21: {
            name: 'CDP_STAKE_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.txUid = arg.srcRegId
                txParams.fees = arg.fees
                txParams.fee_symbol = arg.feeSymbol
                txParams.cdpTxId = arg.cdpTxId
                txParams.assetMap = arg.assetMap
                txParams.scoin_symbol = arg.sCoinSymbol
                txParams.scoinsToMint = arg.sCoinToMint
            }
        },
        22: {
            name: 'CDP_REDEEMP_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.txUid = arg.srcRegId
                txParams.fees = arg.fees
                txParams.cdpTxId = arg.cdpTxId
                txParams.fee_symbol = arg.feeSymbol
                txParams.scoins_to_repay = arg.sCoinsToRepay
                txParams.assetMap = arg.assetMap
            }
        },
        23: {
            name: 'CDP_LIQUIDATE_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.txUid = arg.srcRegId
                txParams.fees = arg.fees
                txParams.fee_symbol = arg.feeSymbol
                txParams.cdpTxId = arg.cdpTxId
                txParams.scoinsToLiquidate = arg.sCoinsToLiquidate
                txParams.assetSymbol = arg.liquidateAssetSymbol

            }
        },
        84: {
            name: 'DEX_LIMIT_BUY_ORDER_TX',
            handler: () => { 
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.srcRegId = arg.srcRegId
                txParams.feeSymbol = arg.feeSymbol
                txParams.coinSymbol = arg.coinSymbol
                txParams.assetSymbol = arg.assetSymbol
                txParams.assetAmount = arg.assetAmount
                txParams.bidPrice = arg.price
            }
        },
        85: {
            name: 'DEX_LIMIT_SELL_ORDER_TX',
            handler: () => { 
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.srcRegId = arg.srcRegId
                txParams.feeSymbol = arg.feeSymbol
                txParams.coinSymbol = arg.coinSymbol
                txParams.assetSymbol = arg.assetSymbol
                txParams.assetAmount = arg.assetAmount
                txParams.askPrice = arg.price
            }
        },
        86: {
            name: 'DEX_MARKET_BUY_ORDER_TX',
            handler: () => { 
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.srcRegId = arg.srcRegId
                txParams.feeSymbol = arg.feeSymbol
                txParams.coinSymbol = arg.coinSymbol
                txParams.assetSymbol = arg.assetSymbol
                txParams.coinAmount = arg.assetAmount
            }
        },
        87: {
            name: 'DEX_MARKET_SELL_ORDER_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.srcRegId = arg.srcRegId
                txParams.feeSymbol = arg.feeSymbol
                txParams.coinSymbol = arg.coinSymbol
                txParams.assetSymbol = arg.assetSymbol
                txParams.assetAmount = arg.assetAmount
            }
        },
        88: {
            name: 'DEX_CANCEL_ORDER_TX',
            handler: () => {
                let pubkey = wallet.publicKeyAsHex().toString()
                txParams.publicKey = pubkey
                txParams.nValidHeight = arg.nValidHeight
                txParams.fees = arg.fees
                txParams.feeSymbol = arg.feeSymbol
                txParams.srcRegId = arg.srcRegId
                txParams.orderId = arg.orderId
            }
        }
    }

    txParamsHandlerMap[txParams.nTxType].handler()

    return txParams
}

module.exports = transactionParams