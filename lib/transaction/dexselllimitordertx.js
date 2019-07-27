'use strict';

var _ = require('lodash');
var $ = require('../util/preconditions');
var Util = require('../util/util')
var BN = require('../crypto/bn');
var Hash = require('../crypto/hash');
var ECDSA = require('../crypto/ecdsa');
var Signature = require('../crypto/signature');
var BufferWriter = require('../encoding/bufferwriter');
var Address = require('../address')

var DexSellLimitOrderTx = function DexSellLimitOrderTx(arg) {
    if (!(this instanceof DexSellLimitOrderTx)) {
      return new DexSellLimitOrderTx(arg);
    }
    var info = DexSellLimitOrderTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.fees = info.fees;
    this.srcRegId = info.srcRegId;
    this.coinType= info.coinType;
    this.assetType= info.assetType;
    this.assetAmount= info.assetAmount;
    this.askPrice= info.askPrice;
    this.network = info.network;
  
    return this;
  };

  DexSellLimitOrderTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = DexSellLimitOrderTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  DexSellLimitOrderTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      fees: data.fees,
      srcRegId: data.srcRegId,
      coinType: data.coinType,
      assetType: data.assetType,
      assetAmount: data.assetAmount,
      askPrice: data.askPrice
    };
    return info;
  };

  DexSellLimitOrderTx.prototype._SignatureHash = function() {
    var writer = new BufferWriter();
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

    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    if(this.coinType.isNull||_.isEmpty(this.coinType)) return false
    writer.writeString(this.coinType)
    if(this.assetType.isNull||_.isEmpty(this.assetType)) return false
    writer.writeString(this.assetType)

    var valueBuf = Util.writeVarInt(8, this.assetAmount)
    writer.write(valueBuf)

    var askPrice = Util.writeVarInt(8, this.askPrice)
    writer.write(askPrice)
 
    var serialBuf = writer.toBuffer()

    //console.log(serialBuf.toString('hex'))

    return Hash.sha256sha256(serialBuf);
  }

  DexSellLimitOrderTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  DexSellLimitOrderTx.prototype.SerializeTx = function(privateKey) {
    var writer = new BufferWriter();
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

    if(! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
      return false;
    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    if(this.coinType.isNull||_.isEmpty(this.coinType)) return false
    writer.writeString(this.coinType)
    if(this.assetType.isNull||_.isEmpty(this.assetType)) return false
    writer.writeString(this.assetType)

    var valueBuf = Util.writeVarInt(8, this.assetAmount)
    writer.write(valueBuf)

    var askPrice = Util.writeVarInt(8, this.askPrice)
    writer.write(askPrice)
  
    writer.writeUInt8(0)
    var sigBuf = this._Signtx(privateKey)
    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)


    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = DexSellLimitOrderTx;