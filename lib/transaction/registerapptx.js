'use strict';

var _ = require('lodash');
var $ = require('../util/preconditions');
var Util = require('../util/util')
var Hash = require('../crypto/hash');
var ECDSA = require('../crypto/ecdsa');
var BufferWriter = require('../encoding/bufferwriter');

var RegisterAppTx = function RegisterAppTx(arg) {
    if (!(this instanceof RegisterAppTx)) {
      return new RegisterAppTx(arg);
    }
    var info = RegisterAppTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.regAcctId = info.regAcctId;
    this.script = info.script;
    this.scryptDesc = info.scriptDesc;
    this.fees = info.fees;
  
    return this;
  };

  RegisterAppTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
      info = RegisterAppTx._fromObject(arg);
    } else {
      throw new TypeError('Unrecognized argument for RegisterAppTx');
    }
    return info;
  };

  RegisterAppTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');
    if (!RegisterAppTx._checkRegId(data.regAcctId)) {
      throw new errors.InvalidArgument("regAcctId", "Invalid reg id");
    }

    var info = {
      nTxType: data.nTxType,
      nVersion: data.nVersion,
      nValidHeight: data.nValidHeight,
      regAcctId: data.regAcctId,
      script: data.script,
      scryptDesc: data.scriptDesc,
      fees: data.fees
    };

    return info;
  };

  RegisterAppTx._checkRegId = function _checkRegId(regId) {
    var regIdData = Util.splitRegID(regId)
    if(_.isNull(regIdData.height) || _.isUndefined(regIdData.height))
        return false
    return true
  }


  RegisterAppTx.prototype._writeVarInt = function(writer, sz, value) {
    var buf = Util.writeVarInt(sz, value)
    writer.write(buf)
  };

  RegisterAppTx.prototype._writeString = function(writer, value) {
    var len = 0
    if (! _.isEmpty(value)) {
      len = value.length
    }
    writer.writeVarintNum(len)
    if (len > 0) {
      writer.write(value)
    }
  };

  RegisterAppTx.prototype._writeBuf = RegisterAppTx.prototype._writeString

  RegisterAppTx.prototype._writeRegId = function(writer, value) {
    var regIdData = Util.splitRegID(value)
    
    var regWriter = new BufferWriter()
    this._writeVarInt(regWriter, 4, regIdData.height)
    this._writeVarInt(regWriter, 2, regIdData.index)
    var regBuf = regWriter.toBuffer()
    this._writeBuf(writer, regBuf)
  };

  RegisterAppTx.prototype._SignatureHash = function() {
    var writer = new BufferWriter();
    //writer.writeVarintNum(this.nVersion)
    // nVersion should use VARINT format
    this._writeVarInt(writer, 4, this.nVersion)
    writer.writeUInt8(this.nTxType)
    this._writeVarInt(writer, 4, this.nValidHeight)
    this._writeRegId(writer, this.regAcctId)

    // write script and desc
    var scriptWriter = new BufferWriter();
    this._writeString(scriptWriter, this.script)
    this._writeString(scriptWriter, this.scriptDesc)
    this._writeBuf(writer, scriptWriter.toBuffer())

    this._writeVarInt(writer, 8, this.fees)

 
    var serialBuf = writer.toBuffer()

    //console.log(serialBuf.toString('hex'))

    return Hash.sha256sha256(serialBuf);
  }

  RegisterAppTx.prototype._Signtx = function(privateKey) {
      var hashbuf = this._SignatureHash()
      var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
      var sigBuf = sig.toBuffer()

      return sigBuf;
  }

  RegisterAppTx.prototype.SerializeTx = function(privateKey) {
    var writer = new BufferWriter();
    writer.writeUInt8(this.nTxType)
    writer.writeVarintNum(this.nVersion)
    this._writeVarInt(writer, 4, this.nValidHeight)
    this._writeRegId(writer, this.regAcctId)

    // write script and desc
    var scriptWriter = new BufferWriter();
    this._writeString(scriptWriter, this.script)
    this._writeString(scriptWriter, this.scriptDesc)
    this._writeBuf(writer, scriptWriter.toBuffer())

    this._writeVarInt(writer, 8, this.fees)

    var sigBuf = this._Signtx(privateKey)
    this._writeBuf(writer, sigBuf)

    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
  }


  module.exports = RegisterAppTx;