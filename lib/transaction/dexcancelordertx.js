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

var DexCancelOrderTx = function DexCancelOrderTx(arg) {
    if (!(this instanceof DexCancelOrderTx)) {
      return new DexCancelOrderTx(arg);
    }
    var info = DexCancelOrderTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.fees = info.fees;
    this.srcRegId = info.srcRegId;
    this.orderId= info.orderId;
    this.feeSymbol=info.feeSymbol;
    this.network = info.network;
  
    return this;
  };

  DexCancelOrderTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = DexCancelOrderTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  DexCancelOrderTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      fees: data.fees,
      srcRegId: data.srcRegId,
      orderId: data.orderId,
      feeSymbol:data.feeSymbol
    };
    return info;
  };

  DexCancelOrderTx.prototype._SignatureHash = function() {
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

    if(this.feeSymbol==null||_.isEmpty(this.feeSymbol)) return fasle;
    writer.writeString(this.feeSymbol)

    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)
 
    if(this.orderId==null) return false
    var orderIdBuf = new Buffer.from(this.orderId, 'hex');
    writer.writeReverse(orderIdBuf);

    var serialBuf = writer.toBuffer()
   // console.log(serialBuf.toString('hex'))
    return Hash.sha256sha256(serialBuf);
  }

  DexCancelOrderTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  DexCancelOrderTx.prototype.SerializeTx = function(privateKey) {
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

    if(this.feeSymbol==null||_.isEmpty(this.feeSymbol)) return fasle;
    writer.writeString(this.feeSymbol)

    if(! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
      return false;
    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    if(this.orderId==null||this.orderId.length==0) return false
    var orderIdBuf = new Buffer.from(this.orderId, 'hex');
    writer.writeReverse(orderIdBuf);


    var sigBuf = this._Signtx(privateKey)
    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)


    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = DexCancelOrderTx;