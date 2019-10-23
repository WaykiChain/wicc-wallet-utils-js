'use strict';
//cdp创建
var _ = require('lodash');
var $ = require('../util/preconditions');
var Util = require('../util/util')
var BN = require('../crypto/bn');
var Hash = require('../crypto/hash');
var ECDSA = require('../crypto/ecdsa');
var Signature = require('../crypto/signature');
var BufferWriter = require('../encoding/bufferwriter');
var WriterHelper = require('../util/writerhelper');
var Address = require('../address')

var CpriceFeedTx = function CpriceFeedTx(arg) {
    if (!(this instanceof CpriceFeedTx)) {
      return new CpriceFeedTx(arg);
    }
    var info = CpriceFeedTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.srcRegId = info.srcRegId;
    this.feedPriceData = info.feedPriceData;
    this.network = info.network;
  
    return this;
  };

  CpriceFeedTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = CpriceFeedTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  CpriceFeedTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');
    if (!Util.checkRegId(data.srcRegId)) {
      throw new errors.InvalidArgument("srcRegId", "Invalid reg id");
    }    
    CpriceFeedTx._checkFeedPriceData(data.feedPriceData)

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      srcRegId: data.srcRegId,
      feedPriceData: data.feedPriceData
    };
    return info;
  };

  CpriceFeedTx.prototype._SignatureHash = function() {
    var writer = new WriterHelper();
    writer.writeVarintNum(this.nVersion)
    writer.writeVarintNum(this.nTxType)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)

    var REGID = Util.splitRegID(this.srcRegId)
    if(_.isNull(REGID.height) || _.isUndefined(REGID.height))
        return false

    var regWriter = new BufferWriter()
    var regHeightBuf = Util.writeVarInt(4, REGID.height)
    regWriter.write(regHeightBuf)
    var regIndexBuf = Util.writeVarInt(2, REGID.index)
    regWriter.write(regIndexBuf)

    var regBuf = regWriter.toBuffer()
    writer.writeUInt8(regBuf.length)
    writer.write(regBuf)

    writer.writeFeedPriceData(this.feedPriceData)

    var serialBuf = writer.toBuffer()
    //console.log(serialBuf.toString('hex'))
    return Hash.sha256sha256(serialBuf);
  }

  CpriceFeedTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  CpriceFeedTx._checkFeedPriceData = function _checkFeedPriceData(feedPriceData) {
    if(!_.isArray(feedPriceData) || _.isEmpty(feedPriceData)) {
      throw new errors.InvalidArgument("delegateData", "delegateData must be array and not empty.");
    }
    
    for(var i = 0; i < feedPriceData.length; i++) {
      var coinPriceType = feedPriceData[i].coinPriceType;
      var coinType = coinPriceType.coinType;
      var priceType = coinPriceType.priceType;

      var price=feedPriceData[i].price

      if(!_.isNumber(coinType)) {
        throw new errors.InvalidArgument("feedPriceData", "feedPriceData[" + i + "].coinPriceType.coinType must be number.");
      }
      if(!_.isNumber(priceType)) {
        throw new errors.InvalidArgument("feedPriceData", "feedPriceData[" + i + "].coinPriceType.priceType. must be number.");
      }
      if(!_.isNumber(price)) {
        throw new errors.InvalidArgument("feedPriceData", "feedPriceData[" + i + "].price must be number.");
      }
    }
  }

  CpriceFeedTx.prototype.SerializeTx = function(privateKey) {
    var writer = new WriterHelper();
    writer.writeVarintNum(this.nTxType)
    writer.writeVarintNum(this.nVersion)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)


    var REGID = Util.splitRegID(this.srcRegId)
    if(_.isNull(REGID.height) || _.isUndefined(REGID.height))
        return false

    var regWriter = new BufferWriter()
    var regHeightBuf = Util.writeVarInt(4, REGID.height)
    regWriter.write(regHeightBuf)
    var regIndexBuf = Util.writeVarInt(2, REGID.index)
    regWriter.write(regIndexBuf)

    var regBuf = regWriter.toBuffer()
    writer.writeUInt8(regBuf.length)
    writer.write(regBuf)

    writer.writeFeedPriceData(this.feedPriceData)

    var sigBuf = this._Signtx(privateKey)

    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)

    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = CpriceFeedTx;