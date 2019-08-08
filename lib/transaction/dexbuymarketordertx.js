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

var DexBuyMarketOrderTx = function DexBuyMarketOrderTx(arg) {
    if (!(this instanceof DexBuyMarketOrderTx)) {
      return new DexBuyMarketOrderTx(arg);
    }
    var info = DexBuyMarketOrderTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.fees = info.fees;
    this.srcRegId = info.srcRegId;
    this.coinType= info.coinType;
    this.assetType= info.assetType;
    this.coinAmount= info.coinAmount;
    this.feeSymbol=info.feeSymbol;
    this.publicKey=info.publicKey;
    this.network = info.network;
  
    return this;
  };

  DexBuyMarketOrderTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = DexBuyMarketOrderTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  DexBuyMarketOrderTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      fees: data.fees,
      srcRegId: data.srcRegId,
      coinType: data.coinType,
      assetType: data.assetType,
      coinAmount: data.coinAmount,
      publicKey:data.publicKey,
      feeSymbol:data.feeSymbol
    };
    return info;
  };

  DexBuyMarketOrderTx.prototype._SignatureHash = function() {
    var writer = new BufferWriter();
    writer.writeVarintNum(this.nVersion)
    writer.writeVarintNum(this.nTxType)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)


    if(this.srcRegId!=null&&!_.isEmpty(this.srcRegId)){
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
      }else if (this.publicKey!=null&&!_.isEmpty(this,this.publicKey)){
       var pubKey= Buffer.from(this.publicKey, 'hex')
        writer.writeUInt8(pubKey.length)
        writer.write(pubKey)
      }else{
       return false;
      }

    if(this.feeSymbol==null||_.isEmpty(this.feeSymbol)) return fasle;
    writer.writeString(this.feeSymbol)

    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    if(this.coinType.isNull||_.isEmpty(this.coinType)) return false
    writer.writeString(this.coinType)
    if(this.assetType.isNull||_.isEmpty(this.assetType)) return false
    writer.writeString(this.assetType)

    var coinAmountBuf = Util.writeVarInt(8, this.coinAmount)
    writer.write(coinAmountBuf)
 
    var serialBuf = writer.toBuffer()

    //console.log(serialBuf.toString('hex'))

    return Hash.sha256sha256(serialBuf);
  }

  DexBuyMarketOrderTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  DexBuyMarketOrderTx.prototype.SerializeTx = function(privateKey) {
    var writer = new BufferWriter();
    writer.writeVarintNum(this.nTxType)
    writer.writeVarintNum(this.nVersion)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)


    if(this.srcRegId!=null&&!_.isEmpty(this.srcRegId)){
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
      }else if (this.publicKey!=null&&!_.isEmpty(this,this.publicKey)){
       var pubKey= Buffer.from(this.publicKey, 'hex')
        writer.writeUInt8(pubKey.length)
        writer.write(pubKey)
      }else{
       return false;
      }

    if(this.feeSymbol==null||_.isEmpty(this.feeSymbol)) return fasle;
    writer.writeString(this.feeSymbol)

    if(! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
      return false;
    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    if(this.coinType.isNull||_.isEmpty(this.coinType)) return false
    writer.writeString(this.coinType)
    if(this.assetType.isNull||_.isEmpty(this.assetType)) return false
    writer.writeString(this.assetType)

    var coinAmountBuf = Util.writeVarInt(8, this.coinAmount)
    writer.write(coinAmountBuf)

    var sigBuf = this._Signtx(privateKey)
    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)


    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = DexBuyMarketOrderTx;