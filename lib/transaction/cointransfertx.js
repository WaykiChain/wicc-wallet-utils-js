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
var bufferUtil = require('../util/buffer');

var CoinTransferTx = function CoinTransferTx(arg) {
    if (!(this instanceof CoinTransferTx)) {
      return new CoinTransferTx(arg);
    }
    var info = CoinTransferTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.srcRegId = info.srcRegId;
    this.destAddr = info.destAddr;
    this.value = info.value;
    this.coinType = info.coinType;
    this.fees = info.fees;
    this.feesCoinType = info.feesCoinType;
    this.memo = info.memo;
    this.network = info.network;
  
    return this;
  };

  CoinTransferTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = CoinTransferTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
  };

  CoinTransferTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');

    var info = {
        nTxType : data.nTxType,
        nVersion : data.nVersion,
        nValidHeight : data.nValidHeight,
        srcRegId : data.srcRegId,
        destAddr : data.destAddr,
        value : data.value,
        coinType : data.coinType,
        fees : data.fees,
        feesCoinType : data.feesCoinType,
        memo : data.memo
    };
    return info;
  };

  CoinTransferTx.prototype._SignatureHash = function() {
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

    var addr = Address.fromString(this.destAddr, this.network, 'pubkeyhash')
    //console.log(addr.hashBuffer.toString('hex'))

    var size = addr.hashBuffer.length
    writer.writeUInt8(size)
    writer.write(addr.hashBuffer)

    var valueBuf = Util.writeVarInt(8, this.value)
    writer.write(valueBuf)

    var coinTypeBuf = Util.writeVarInt(8, this.coinType)
    writer.write(coinTypeBuf)

    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    var feesCoinTypeBuf = Util.writeVarInt(8, this.feesCoinType)
    writer.write(feesCoinTypeBuf)

    var len = 0
    var buf = this.memo
    if (!_.isEmpty(this.memo)) {
        if (!bufferUtil.isBuffer(buf)) {
            buf = Buffer.from(buf)
        }
        len = buf.length
    }
    writer.writeVarintNum(len)
    if (len > 0) {
      writer.write(buf)
    }
 
    var serialBuf = writer.toBuffer()

    //console.log(serialBuf.toString('hex'))

    return Hash.sha256sha256(serialBuf);
  }

  CoinTransferTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  CoinTransferTx.prototype.SerializeTx = function(privateKey) {
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

    var addr = Address.fromString(this.destAddr, this.network, 'pubkeyhash')
    //console.log(addr.hashBuffer.toString('hex'))

    var size = addr.hashBuffer.length
    writer.writeUInt8(size)
    writer.write(addr.hashBuffer)

    if(! /^[1-9]*[1-9][0-9]*$/.test(this.value))
      return false;

    var valueBuf = Util.writeVarInt(8, this.value)
    writer.write(valueBuf)

    
    var coinTypeBuf = Util.writeVarInt(8, this.coinType)
    writer.write(coinTypeBuf)

    if(! /^[1-9]*[1-9][0-9]*$/.test(this.fees))
    return false;
    var feesBuf = Util.writeVarInt(8, this.fees)
    writer.write(feesBuf)

    var feesCoinTypeBuf = Util.writeVarInt(8, this.feesCoinType)
    writer.write(feesCoinTypeBuf)

    var len = 0
    var buf = this.memo
    if (!_.isEmpty(this.memo)) {
        if (!bufferUtil.isBuffer(buf)) {
            buf = Buffer.from(buf)
        }
        len = buf.length
    }
    writer.writeVarintNum(len)
    if (len > 0) {
      writer.write(buf)
    }
 
  

    var sigBuf = this._Signtx(privateKey)

    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)


    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = CoinTransferTx;