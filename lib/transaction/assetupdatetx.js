'use strict';

var _ = require('lodash');
var assert = require("assert");
var $ = require('../util/preconditions');
var Util = require('../util/util')
var Hash = require('../crypto/hash');
var ECDSA = require('../crypto/ecdsa');
var WriterHelper = require('../util/writerhelper');
var errors = require('../errors');

var AssetUpdateTx = function AssetUpdateTx(arg) {
  if (!(this instanceof AssetUpdateTx)) {
    return new AssetUpdateTx(arg);
  }
  var info = AssetUpdateTx._from(arg);
  this.nTxType = info.nTxType;
  this.nVersion = info.nVersion;
  this.nValidHeight = info.nValidHeight;
  this.srcRegId = info.srcRegId;
  this.destRegId = info.destRegId;
  this.fees = info.fees;
  this.feesCoinSymbol = info.feesCoinSymbol;
  this.publicKey = info.publicKey;
  this.assetUpdateData = info.assetUpdateData;
  this.assetSymbol = info.assetSymbol;

  return this;
};

AssetUpdateTx._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = AssetUpdateTx._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for ContractTx');
  }
  return info;
};

AssetUpdateTx._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');
  if (!Util.checkRegId(data.srcRegId)) {
    throw new errors.InvalidArgument("srcRegId", "Invalid reg id");
  }

  var info = {
    nTxType: data.nTxType,
    nVersion: data.nVersion,
    nValidHeight: data.nValidHeight,
    srcRegId: data.srcRegId,
    destRegId: data.destRegId,
    fees: data.fees,
    publicKey: data.publicKey,
    feesCoinSymbol: data.feesCoinSymbol,
    assetUpdateData: data.assetUpdateData,
    assetSymbol: data.assetSymbol,
  };
  return info;
};

AssetUpdateTx.prototype._SignatureHash = function () {
  var writer = new WriterHelper();
  writer.writeVarInt(4, this.nVersion)
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nValidHeight)

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId)
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }
  writer.writeString(Buffer.from(this.feesCoinSymbol))
  writer.writeVarInt(8, this.fees)
  writer.writeString(Buffer.from(this.assetSymbol))
  writer.writeassetUpdateData(this.assetUpdateData)

  var serialBuf = writer.toBuffer()

  //console.log(serialBuf.toString('hex'))

  return Hash.sha256sha256(serialBuf);
}

AssetUpdateTx.prototype._Signtx = function (privateKey) {
  var hashbuf = this._SignatureHash()
  var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
  var sigBuf = sig.toBuffer()

  return sigBuf;
}

AssetUpdateTx.prototype.SerializeTx = function (privateKey) {
  var writer = new WriterHelper();
  writer.writeUInt8(this.nTxType)
  writer.writeVarInt(4, this.nVersion)
  writer.writeVarInt(4, this.nValidHeight)

  if (this.srcRegId != null && !_.isEmpty(this.srcRegId)) {
    writer.writeRegId(this.srcRegId)
  } else if (this.publicKey != null && !_.isEmpty(this, this.publicKey)) {
    var pubKey = Buffer.from(this.publicKey, 'hex')
    writer.writeUInt8(pubKey.length)
    writer.write(pubKey)
  } else {
    return false;
  }
  writer.writeString(Buffer.from(this.feesCoinSymbol))
  writer.writeVarInt(8, this.fees)
  writer.writeString(Buffer.from(this.assetSymbol))
  writer.writeassetUpdateData(this.assetUpdateData)

  var sigBuf = this._Signtx(privateKey)
  writer.writeBuf(sigBuf)

  var hexBuf = writer.toBuffer()
  var hex = hexBuf.toString('hex')

  return hex
}


module.exports = AssetUpdateTx;
