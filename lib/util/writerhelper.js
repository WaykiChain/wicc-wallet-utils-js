'use strict';

var _ = require('lodash');
var inherits = require('inherits');
var BufferWriter = require('../encoding/bufferwriter');
var Util = require('./util.js')
var bufferUtil = require('./buffer');
var assert = require('assert');

/**
 * @desc
 * Wrapper around BufferWriter for enhanced extention
 *
 * @param {Object|string|WriterHelper} obj
 * @constructor
 */
function WriterHelper(obj) {
    if (!(this instanceof WriterHelper)) {
        return new WriterHelper(obj);
    }
    if (obj instanceof WriterHelper) {
        return obj;
    }
    BufferWriter.call(this)

}

inherits(WriterHelper, BufferWriter);

WriterHelper.prototype.writeVarInt = function(sz, value) {
    var buf = Util.writeVarInt(sz, value)
    this.write(buf)
};

// write the string len and string
WriterHelper.prototype.writeString = function(value) {
    assert(value == undefined || _.isString(value) || bufferUtil.isBuffer(value))
    var len = 0
    var buf = value
    if (!_.isEmpty(value)) {
        if (!bufferUtil.isBuffer(buf)) {
            buf = Buffer.from(buf)
        }
        len = buf.length
    }
    this.writeVarintNum(len)
    if (len > 0) {
        this.write(buf)
    }
};

// write the buf len and buf
WriterHelper.prototype.writeBuf = function(value) {
    var len = 0
    if (!_.isEmpty(value)) {
        assert(bufferUtil.isBuffer(value))
        len = value.length
    }
    this.writeVarintNum(len)
    if (len > 0) {
        this.write(value)
    }
};

WriterHelper.prototype.writeRegId = function(value) {
    var regIdData = Util.splitRegID(value)

    var intWriter = new WriterHelper()
    intWriter.writeVarInt(4, regIdData.height)
    intWriter.writeVarInt(2, regIdData.index)
    this.writeBuf(intWriter.toBuffer())
};

WriterHelper.prototype.VoteOperType = {
  ADD_FUND: 1,       //!< add operate
  MINUS_FUND: 2      //!< minus operate
}

/**
 * delegateData    array,  item is object data of delegate
 * [
 *     {
 *         publicKey: string    the public key that the votes are received,
 *         votes: number        vote number
 *     },
 *]
 */
WriterHelper.prototype.writeDelegateData = function(delegateData) {

  this.writeVarintNum(delegateData.length);

  for(var i = 0; i < delegateData.length; i++) {
    var operType = this.VoteOperType.ADD_FUND; 
    if (delegateData.votes < 0) {
      operType = this.VoteOperType.MINUS_FUND; 
    }
    var votes_abs = Math.abs(delegateData[i].votes);
    this.writeUInt8(operType);
    this.writeString(Buffer.from(delegateData[i].publicKey, 'hex'));
    this.writeVarInt(8, votes_abs)
  }
}

WriterHelper.prototype.writeFeedPriceData = function(feedPriceData) {

    this.writeVarintNum(feedPriceData.length);

    for(var i = 0; i < feedPriceData.length; i++) {
        var coinPriceType = feedPriceData[i].coinPriceType;
        var coinType = coinPriceType.coinType;
        var priceType = coinPriceType.priceType;

      var price = feedPriceData[i].price;
      this.writeVarintNum(coinType);
      this.writeVarintNum(priceType);
      this.writeVarInt(8, price)
    }
  }

  WriterHelper.prototype.writeDexSettleData = function(dexsettledata) {

    this.writeVarintNum(dexsettledata.length);

    for(var i = 0; i < dexsettledata.length; i++) {
    var buyOrderId = dexsettledata[i].buyOrderId;
    var sellOrderId = dexsettledata[i].sellOrderId;
    var dealPrice = dexsettledata[i].dealPrice;
    var dealCoinAmount = dexsettledata[i].dealCoinAmount;
    var dealAssetAmount = dexsettledata[i].dealAssetAmount;

    var buyOrderIdBuf = new Buffer.from(buyOrderId, 'hex');
    this.writeVarintNum(buyOrderIdBuf.length);
    this.write(bufferUtil.reverse(buyOrderIdBuf));

    var sellOrderIdBuf = new Buffer.from(sellOrderId, 'hex');
    this.writeVarintNum(sellOrderIdBuf.length);
    this.write(bufferUtil.reverse(sellOrderIdBuf));

    this.writeVarInt(8, dealPrice);
    this.writeVarInt(8, dealCoinAmount);
    this.writeVarInt(8, dealAssetAmount);
    }
  }

  WriterHelper.prototype.PriceType =  {
    USD     : 0,
    CNY     : 1,
    EUR     : 2,
    BTC     : 10,
    USDT    : 11,
    GOLD    : 20,
    KWH     :100
  }

  WriterHelper.prototype.CoinType= {
       WICC                : "WICC",
       WGRT                : "WGRT",
       WUSD                : "WUSD",
       WCNY                : "WCNY",

       WBTC                : "WBTC",
       WETH                : "WETH",
       WEOS                : "WEOS",

       USD                 : "USD",
       CNY                 : "CNY",
       EUR                 : "EUR",
       BTC                 : "BTC",
       USDT                : "USDT",
       GOLD                : "GOLD",
       KWH                 : "KWH",
  }
  WriterHelper.prototype.BalanceOpType= {
    NULL_OP : 0,
    ADD_FREE : 1,
    SUB_FREE : 2
   }

module.exports = WriterHelper;
