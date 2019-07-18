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
var Address = require('../address')

var CdpLiquiDateTx = function CdpLiquiDateTx(arg) {
    if (!(this instanceof CdpLiquiDateTx)) {
      return new CdpLiquiDateTx(arg);
    }
    var info = CdpLiquiDateTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.txUid = info.txUid;
    this.fees = info.fees;
    this.cdpOwnerRegId=info.cdpOwnerRegId,
    this.cdpTxId = info.cdpTxId;
    this.scoinsToLiquidate = info.scoinsToLiquidate;
    this.scoinsPenalty = info.scoinsPenalty;
  
    return this;
  };

  CdpLiquiDateTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = CdpLiquiDateTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  CdpLiquiDateTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      txUid: data.txUid,
      fees: data.fees,
      cdpOwnerRegId:data.cdpOwnerRegId,
      cdpTxId: data.cdpTxId,
      scoinsToLiquidate: data.scoinsToLiquidate,
      scoinsPenalty: data.scoinsPenalty
    };
    return info;
  };

  CdpLiquiDateTx.prototype._SignatureHash = function() {
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

    var OWNERREGID = Util.splitRegID(this.cdpOwnerRegId)
    if(_.isNull(OWNERREGID.height) || _.isUndefined(OWNERREGID.height))
        return false

    var ownerRegWriter = new BufferWriter()
    var ownerRegHeightBuf = Util.writeVarInt(4, OWNERREGID.height)
    ownerRegWriter.write(ownerRegHeightBuf)
    var ownerRegIndexBuf = Util.writeVarInt(2, OWNERREGID.index)
    ownerRegWriter.write(ownerRegIndexBuf)

    var ownerRegBuf = ownerRegWriter.toBuffer()
    writer.writeUInt8(ownerRegBuf.length)
    writer.write(ownerRegBuf)

    if(this.cdpTxId==null||this.cdpTxId.length<64) return false
     var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
     writer.writeReverse(cdpTxidBuf)

     if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsToLiquidate))
     return false;
    var scoinsToLiquidate = Util.writeVarInt(8, this.scoinsToLiquidate)
    writer.write(scoinsToLiquidate)

    if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsPenalty))
     return false;
    var collateralRatio = Util.writeVarInt(8, this.scoinsPenalty)
    writer.write(collateralRatio)
   
 
    var serialBuf = writer.toBuffer()

    //console.log(serialBuf.toString('hex'))
    return Hash.sha256sha256(serialBuf);
  }

  CdpLiquiDateTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  CdpLiquiDateTx.prototype.SerializeTx = function(privateKey) {
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

    var OWNERREGID = Util.splitRegID(this.cdpOwnerRegId)
    if(_.isNull(OWNERREGID.height) || _.isUndefined(OWNERREGID.height))
        return false

    var ownerRegWriter = new BufferWriter()
    var ownerRegHeightBuf = Util.writeVarInt(4, OWNERREGID.height)
    ownerRegWriter.write(ownerRegHeightBuf)
    var ownerRegIndexBuf = Util.writeVarInt(2, OWNERREGID.index)
    ownerRegWriter.write(ownerRegIndexBuf)

    var ownerRegBuf = ownerRegWriter.toBuffer()
    writer.writeUInt8(ownerRegBuf.length)
    writer.write(ownerRegBuf)

   
    if(this.cdpTxId==null||this.cdpTxId.length<64) return false
     var cdpTxidBuf = new Buffer.from(this.cdpTxId, 'hex')
     writer.writeReverse(cdpTxidBuf)

     if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsToLiquidate))
     return false;
    var scoinsToLiquidate = Util.writeVarInt(8, this.scoinsToLiquidate)
    writer.write(scoinsToLiquidate)

    console.log("cdpTxId")
    if(! /^[1-9]*[1-9][0-9]*$/.test(this.scoinsPenalty))
     return false;
    var collateralRatio = Util.writeVarInt(8, this.scoinsPenalty)
    writer.write(collateralRatio)

    var sigBuf = this._Signtx(privateKey)

    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)


    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = CdpLiquiDateTx;