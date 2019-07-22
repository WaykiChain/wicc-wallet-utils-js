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

var DexSettleTx = function DexSettleTx(arg) {
    if (!(this instanceof DexSettleTx)) {
        return new DexSettleTx(arg);
    }
    var info = DexSettleTx._from(arg);
    this.nTxType = info.nTxType;
    this.nVersion = info.nVersion;
    this.nValidHeight = info.nValidHeight;
    this.fees = info.fees;
    this.srcRegId = info.srcRegId;
    this.dexDealItems = info.dexDealItems;
    this.network = info.network;

    return this;
};

DexSettleTx._from = function _from(arg) {
    var info = {};
    if (_.isObject(arg)) {
        info = DexSettleTx._fromObject(arg);
    } else {
        throw new TypeError('Unrecognized argument for CommonTx');
    }
    return info;
};

DexSettleTx._fromObject = function _fromObject(data) {
    $.checkArgument(data, 'data is required');
    if (!Util.checkRegId(data.srcRegId)) {
        throw new errors.InvalidArgument("srcRegId", "Invalid reg id");
    }
    DexSettleTx._checkFeedPriceData(data.dexDealItems)

    var info = {
        nTxType: data.nTxType,
        nVersion: data.nVersion,
        nValidHeight: data.nValidHeight,
        fees: data.fees,
        srcRegId: data.srcRegId,
        dexDealItems: data.dexDealItems
    };
    return info;
};

DexSettleTx.prototype._SignatureHash = function () {
    var writer = new WriterHelper();
    writer.writeVarintNum(this.nVersion)
    writer.writeVarintNum(this.nTxType)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)

    var REGID = Util.splitRegID(this.srcRegId)
    if (_.isNull(REGID.height) || _.isUndefined(REGID.height))
        return false

    var regWriter = new BufferWriter()
    var regHeightBuf = Util.writeVarInt(4, REGID.height)
    regWriter.write(regHeightBuf)
    var regIndexBuf = Util.writeVarInt(2, REGID.index)
    regWriter.write(regIndexBuf)

    var regBuf = regWriter.toBuffer()
    writer.writeUInt8(regBuf.length)
    writer.write(regBuf)
    writer.writeVarInt(8, this.fees);

    writer.writeDexSettleData(this.dexDealItems)

    var serialBuf = writer.toBuffer()
    //console.log(serialBuf.toString('hex'))
    return Hash.sha256sha256(serialBuf);
}

DexSettleTx.prototype._Signtx = function (privateKey) {
    var hashbuf = this._SignatureHash()
    var sig = ECDSA.sign(hashbuf, privateKey, 'endian')
    var sigBuf = sig.toBuffer()

    return sigBuf;
}

DexSettleTx._checkFeedPriceData = function _checkFeedPriceData(dexsettledata) {
    if (!_.isArray(dexsettledata) || _.isEmpty(dexsettledata)) {
        throw new errors.InvalidArgument("dexsettledata", "delegateData must be array and not empty.");
    }

    for (var i = 0; i < dexsettledata.length; i++) {
        var buyOrderId = dexsettledata[i].buyOrderId;
        var sellOrderId = dexsettledata[i].sellOrderId;
        var dealPrice = dexsettledata[i].dealPrice;
        var dealCoinAmount = dexsettledata[i].dealCoinAmount;
        var dealAssetAmount = dexsettledata[i].dealAssetAmount;

        if (typeof (buyOrderId) !== 'string' || _.isEmpty(buyOrderId)) {
            throw new errors.InvalidArgument("dexsettledata", "dexsettledata[" + i + "].buyOrderId must be string, and not empty.");
        }

        if (typeof (sellOrderId) !== 'string' || _.isEmpty(sellOrderId)) {
            throw new errors.InvalidArgument("dexsettledata", "dexsettledata[" + i + "].sellOrderId must be string, and not empty.");
        }

        if (!_.isNumber(dealPrice)) {
            throw new errors.InvalidArgument("dexsettledata", "dexsettledata[" + i + "].dealPrice must be number.");
        }

        if (!_.isNumber(dealCoinAmount)) {
            throw new errors.InvalidArgument("dexsettledata", "dexsettledata[" + i + "].dealCoinAmount must be number.");
        }

        if (!_.isNumber(dealAssetAmount)) {
            throw new errors.InvalidArgument("dexsettledata", "dexsettledata[" + i + "].dealAssetAmount must be number.");
        }
    }
}

DexSettleTx.prototype.SerializeTx = function (privateKey) {
    var writer = new WriterHelper();
    writer.writeVarintNum(this.nTxType)
    writer.writeVarintNum(this.nVersion)
    var heightBuf = Util.writeVarInt(4, this.nValidHeight)
    writer.write(heightBuf)


    var REGID = Util.splitRegID(this.srcRegId)
    if (_.isNull(REGID.height) || _.isUndefined(REGID.height))
        return false

    var regWriter = new BufferWriter()
    var regHeightBuf = Util.writeVarInt(4, REGID.height)
    regWriter.write(regHeightBuf)
    var regIndexBuf = Util.writeVarInt(2, REGID.index)
    regWriter.write(regIndexBuf)

    var regBuf = regWriter.toBuffer()
    writer.writeUInt8(regBuf.length)
    writer.write(regBuf)
    writer.writeVarInt(8, this.fees);
    writer.writeDexSettleData(this.dexDealItems)

    var sigBuf = this._Signtx(privateKey)

    var len = sigBuf.length
    writer.writeVarintNum(len)
    writer.write(sigBuf)

    var hexBuf = writer.toBuffer()
    var hex = hexBuf.toString('hex')

    return hex
}

module.exports = DexSettleTx;