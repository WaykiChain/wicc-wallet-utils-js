'use strict';
//cdp赎回
var _ = require('lodash');
var $ = require('../util/preconditions');
var Util = require('../util/util')
var BN = require('../crypto/bn');
var Hash = require('../crypto/hash');
var ECDSA = require('../crypto/ecdsa');
var Signature = require('../crypto/signature');
var BufferWriter = require('../encoding/bufferwriter');
var Address = require('../address')

var CdpRedeemTx = function CdpRedeemTx(arg) {
    if (!(this instanceof CdpRedeemTx)) {
      return new CdpRedeemTx(arg);
    }
    var info = CdpRedeemTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.txUid = info.txUid;
    this.fees = info.fees;
    this.cdpTxId = info.cdpTxId;
    this.scoinsToRedeem = info.scoinsToRedeem;
    this.collateralRatio = info.collateralRatio;
    this.scoinsInterest = info.scoinsInterest;
    this.network = info.network;
  
    return this;
  };

  CdpRedeemTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = CdpRedeemTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  CdpRedeemTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      txUid: data.txUid,
      fees: data.fees,
      cdpTxId: data.cdpTxId,
      scoinsToRedeem: data.scoinsToRedeem,
      collateralRatio: data.collateralRatio,
      scoinsInterest: data.scoinsInterest
    };
    return info;
  };

  CdpRedeemTx.prototype._SignatureHash = function() {
    var writer = new BufferWriter();
    writer.writeVarintNum(this.nVersion)
    writer.writeVarintNum(this.nTxType)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)

    var REGID = Util.splitRegID(this.txUid)
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
    if(this.cdpTxId==null) return false
     var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
     writer.writeReverse(cdpTxidBuf)
   
     if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsToRedeem))
      return false;
     var scoinsToRedeem = Util.writeVarInt(8, this.scoinsToRedeem)
    writer.write(scoinsToRedeem)
    if(! /^[1-9]*[1-9][0-9]*$/.test(this.collateralRatio))
    return false;
    var collateralRatio = Util.writeVarInt(8, this.collateralRatio)
    writer.write(collateralRatio)
    if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsInterest))
    return false;
    var scoinsInterest = Util.writeVarInt(8, this.scoinsInterest)
    writer.write(scoinsInterest)
 
    var serialBuf = writer.toBuffer()
   // console.log(serialBuf.toString('hex'))
    return Hash.sha256sha256(serialBuf);
  }

  CdpRedeemTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  CdpRedeemTx.prototype.SerializeTx = function(privateKey) {
    var writer = new BufferWriter();
    writer.writeVarintNum(this.nTxType)
    writer.writeVarintNum(this.nVersion)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)


    var REGID = Util.splitRegID(this.txUid)
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

    if(this.cdpTxId==null) return false
     var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
     writer.writeReverse(cdpTxidBuf)

     if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsToRedeem))
      return false;
     var scoinsToRedeem = Util.writeVarInt(8, this.scoinsToRedeem)
    writer.write(scoinsToRedeem)
    if(! /^[1-9]*[1-9][0-9]*$/.test(this.collateralRatio))
    return false;
    var collateralRatio = Util.writeVarInt(8, this.collateralRatio)
    writer.write(collateralRatio)
    if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsInterest))
    return false;
    var scoinsInterest = Util.writeVarInt(8, this.scoinsInterest)
    writer.write(scoinsInterest)

    var sigBuf = this._Signtx(privateKey)

    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)


    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = CdpRedeemTx;