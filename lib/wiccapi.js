'use strict';

var _ = require('lodash');
var $ = require('./util/preconditions');
var Mnemonic = require('./mnemonic')
var Address = require('./address')
var RegisterAccountTx = require('./transaction/registeraccounttx')
var CommonTx = require('./transaction/commontx')
var ContractTx = require('./transaction/contracttx')
var DelegateTx = require('./transaction/delegatetx')
var Random = require('./crypto/random')
var Hash = require('./crypto/hash')
var buffer = require('buffer')
var scrypt = require('scryptsy')
var aes = require('./aes-cbc')
var CryptoJS = require('crypto-js')
var HDPrivateKey = require('./hdprivatekey')
var CustomBuffer = require('./util/buffer')
var RegisterAppTx = require('./transaction/registerapptx')
var CpriceFeedTx = require('./transaction/cpricefeedtx')
var UContractTx = require('./transaction/ucontractinvoketx')
var AssetCreateTx = require('./transaction/assetcreatetx')
var AssetUpdateTx = require('./transaction/assetupdatetx')

var WiccApi = function WiccApi(arg) {
  if (!(this instanceof WiccApi)) {
    return new WiccApi(arg);
  }
  var info = WiccApi._from(arg);
  this.network = arg.network
  return this;
};

WiccApi._from = function _from(arg) {
  var info = {};
  if (_.isObject(arg)) {
    info = WiccApi._fromObject(arg);
  } else {
    throw new TypeError('Unrecognized argument for WiccApi');
  }
  return info;
};

WiccApi._fromObject = function _fromObject(data) {
  $.checkArgument(data, 'data is required');

  var info = {
    network: data.network
  };
  return info;
};

WiccApi.prototype.createAllCoinMnemonicCode = function () {
  var code = new Mnemonic(Mnemonic.Words.ENGLISH)
  var strCode = code.toString()

  return strCode
}

WiccApi.prototype.checkMnemonicCode = function (mnemonic) {
  return Mnemonic.isValid(mnemonic)
}

WiccApi.prototype.validateAddress = function (address) {
  return Address.isValid(address, this.network)
}

WiccApi.prototype.getPriKeyFromMnemonicCode = function (mnemonic) {
  var code = new Mnemonic(mnemonic)
  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild("m/44'/99999'/0'/0/0");
  return p.privateKey.toWIF()
}

WiccApi.prototype.getAddressFromMnemonicCode = function (mnemonic) {
  var code = new Mnemonic(mnemonic)
  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild("m/44'/99999'/0'/0/0");
  return p.privateKey.toAddress()
}

WiccApi.prototype.createWallet = function (mnemonic, password) {
  var salt = Random.getRandomBuffer(8)

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)

  var code = new Mnemonic(mnemonic)
  var strCode = code.toString()

  var seed = code.toSeed()

  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild("m/44'/99999'/0'/0/0");
  var address = p.privateKey.toAddress()
  var strAddress = address.toString()

  var d = new Date()
  var creationTimeSeconds = parseInt(d.getTime() / 1000)


  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var strSeed = seed.toString('hex')
  var encryptedseed = aes.encrypt(cryKey, cryIv, strSeed)
  var encryptedMne = aes.encrypt(cryKey, cryIv, strCode)

  var encSeedData = {
    encryptedBytes: encryptedseed,
    iv: iv
  }

  var encMneData = {
    encryptedBytes: encryptedMne,
    iv: iv
  }

  var seedinfo = {
    encMneData: encMneData,
    encSeedData: encSeedData,
    creationTimeSeconds: creationTimeSeconds,
    hashPwd: hashpwd,
    salt: salt
  }

  var wallinfo = {
    seedinfo: seedinfo,
    symbol: 'WICC',
    address: strAddress
  }

  return wallinfo

}

//Otto kafka wallet for bittrex
WiccApi.prototype.createWallet = function (mnemonic, password, nonce) {
  var salt = Random.getRandomBuffer(8)

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)

  var code = new Mnemonic(mnemonic)
  var strCode = code.toString()

  var seed = code.toSeed()

  var xpriv = code.toHDPrivateKey(null, this.network);
  var p = xpriv.deriveChild(`m/44/99999/0/0/${nonce}`);
  var address = p.privateKey.toAddress()
  var strAddress = address.toString()

  var d = new Date()
  var creationTimeSeconds = parseInt(d.getTime() / 1000)


  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var strSeed = seed.toString('hex')
  var encryptedseed = aes.encrypt(cryKey, cryIv, strSeed)
  var encryptedMne = aes.encrypt(cryKey, cryIv, strCode)

  var encSeedData = {
    encryptedBytes: encryptedseed,
    iv: iv
  }

  var encMneData = {
    encryptedBytes: encryptedMne,
    iv: iv
  }

  var seedinfo = {
    encMneData: encMneData,
    encSeedData: encSeedData,
    creationTimeSeconds: creationTimeSeconds,
    hashPwd: hashpwd,
    salt: salt
  }

  var wallinfo = {
    seedinfo: seedinfo,
    symbol: 'WICC',
    address: strAddress
  }

  return wallinfo

}

WiccApi.prototype.getPriKeyFromSeed = function (seedinfo, password) {

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64seed = seedinfo.encSeedData.encryptedBytes
  var strseed = aes.decrypt(cryKey, cryIv, base64seed)
  var seed = new Buffer(strseed, 'hex')
  /*
  var code = Mnemonic.fromSeed(seed, Mnemonic.Words.ENGLISH)
  var strCode = code.toString()

  var xpriv = code.toHDPrivateKey(null, 'testnet');
  */

  var xpriv = HDPrivateKey.fromSeed(seed, this.network);
  var p = xpriv.deriveChild("m/44'/99999'/0'/0/0");

  return p.privateKey.toWIF()
}

WiccApi.prototype.getMnemonicCodeFromSeed = function (seedinfo, password) {

  var passbuf = new buffer.Buffer(password, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(password, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64Mne = seedinfo.encMneData.encryptedBytes
  var Mne = aes.decrypt(cryKey, cryIv, base64Mne)

  return Mne
}

WiccApi.prototype.changePassword = function (seedinfo, oldpassword, newpassword) {

  var passbuf = new buffer.Buffer(oldpassword, 'utf8');
  var hashpwd = Hash.sha256(passbuf)
  if (!CustomBuffer.equal(hashpwd, seedinfo.hashPwd)) {
    return null
  }

  var salt = seedinfo.salt
  var data = scrypt(oldpassword, salt, 32768, 8, 1, 64)

  var key = data.slice(0, 32)
  var iv = data.slice(32, 48)

  var hexKey = key.toString('hex')
  var cryKey = CryptoJS.enc.Hex.parse(hexKey)

  var hexIv = iv.toString('hex')
  var cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var base64seed = seedinfo.encSeedData.encryptedBytes
  var strseed = aes.decrypt(cryKey, cryIv, base64seed)
  var base64Mne = seedinfo.encMneData.encryptedBytes
  var Mne = aes.decrypt(cryKey, cryIv, base64Mne)

  var newpassbuf = new buffer.Buffer(newpassword, 'utf8');
  var newhashpwd = Hash.sha256(newpassbuf)

  data = scrypt(newpassword, salt, 32768, 8, 1, 64)

  key = data.slice(0, 32)
  iv = data.slice(32, 48)

  hexKey = key.toString('hex')
  cryKey = CryptoJS.enc.Hex.parse(hexKey)

  hexIv = iv.toString('hex')
  cryIv = CryptoJS.enc.Hex.parse(hexIv)

  var encryptedseed = aes.encrypt(cryKey, cryIv, strseed)
  var encryptedMne = aes.encrypt(cryKey, cryIv, Mne)

  var encSeedData = {
    encryptedBytes: encryptedseed,
    iv: iv
  }

  var encMneData = {
    encryptedBytes: encryptedMne,
    iv: iv
  }

  var newseedinfo = {
    encMneData: encMneData,
    encSeedData: encSeedData,
    creationTimeSeconds: seedinfo.creationTimeSeconds,
    hashPwd: newhashpwd,
    salt: salt
  }

  return newseedinfo
}

WiccApi.prototype.createSignTransaction = function (privkey, txType, txData) {
  if (txType == WiccApi.REGISTER_ACCOUNT_TX) {
    var register = new RegisterAccountTx(txData)
    return register.SerializeTx(privkey)
  }
  else if (txType == WiccApi.COMMON_TX) {
    var commonTx = new CommonTx(txData)
    return commonTx.SerializeTx(privkey)
  }
  else if (txType == WiccApi.CONTRACT_TX) {
    var contractTx = new ContractTx(txData)
    return contractTx.SerializeTx(privkey)
  }
  else if (txType == WiccApi.REG_APP_TX) {
    var registerAppTx = new RegisterAppTx(txData)
    return registerAppTx.SerializeTx(privkey)
  }
  else if (txType == WiccApi.DELEGATE_TX) {
    var delegateTx = new DelegateTx(txData)
    return delegateTx.SerializeTx(privkey)
  } else if (txType == WiccApi.PRICE_FEED_TX) {
    var cPriceFeedTx = new CpriceFeedTx(txData)
    return cPriceFeedTx.SerializeTx(privkey)
  }  else if (txType == WiccApi.UCOIN_CONTRACT_INVOKE_TX) {
    var ucontractTx = new UContractTx(txData)
    return ucontractTx.SerializeTx(privkey)
  }
  else if (txType == WiccApi.ASSET_ISUUE) {
    var assetIssueTx = new AssetCreateTx(txData)
    return assetIssueTx.SerializeTx(privkey)
  } else if (txType == WiccApi.ASSET_UPDATE) {
    var assetUpdateTx = new AssetUpdateTx(txData)
    return assetUpdateTx.SerializeTx(privkey)
  }
}

WiccApi.PROTOCAL_VERSION = 1;

WiccApi.REGISTER_ACCOUNT_TX = 2;
WiccApi.COMMON_TX = 3;
WiccApi.CONTRACT_TX = 4;
WiccApi.REG_APP_TX = 5,   	//!< register app
  WiccApi.DELEGATE_TX = 6;

WiccApi.FCOIN_STAKE_TX = 8;

WiccApi.ASSET_ISUUE = 9;
WiccApi.ASSET_UPDATE = 10;

WiccApi.UCOIN_TRANSFER_TX = 11;
WiccApi.UCOIN_CONTRACT_INVOKE_TX = 15;
WiccApi.PRICE_FEED_TX = 16;

WiccApi.CDP_STAKE_TX = 21;
WiccApi.CDP_REDEEMP_TX = 22;
WiccApi.CDP_LIQUIDATE_TX = 23;

WiccApi.DEX_SETTLE_TX = 89;  //!< dex settle Tx
WiccApi.DEX_CANCEL_ORDER_TX = 88;  //!< dex cancel order Tx
WiccApi.DEX_BUY_LIMIT_ORDER_TX = 84;  //!< dex buy limit price order Tx
WiccApi.DEX_SELL_LIMIT_ORDER_TX = 85;  //!< dex sell limit price order Tx
WiccApi.DEX_BUY_MARKET_ORDER_TX = 86;  //!< dex buy market price order Tx
WiccApi.DEX_SELL_MARKET_ORDER_TX = 87; //!< dex sell market price order Tx


//彩种
WiccApi.LOTTERY_FOOTBALL = 1; //足彩
WiccApi.LOTTERY_BASKETBALL = 2; //篮彩

//足彩玩法
WiccApi.PLAY_FOOTBALL_SPF = 1; // 胜平负
WiccApi.PLAY_FOOTBALL_TOTAL_NUM = 2; //总进球
WiccApi.PLAY_FOOTBALL_ODD_EVEN = 3; //单双
WiccApi.PLAY_FOOTBALL_HALF = 4; //半全场

//足彩胜平负投注方案
WiccApi.FOOTBALL_SPF_WIN = 1; //主胜
WiccApi.FOOTBALL_SPF_EVEN = 2; //平
WiccApi.FOOTBALL_SPF_LOSE = 3; //主负

//足彩总进球投注方案
WiccApi.FOOTBALL_TOTAL_0 = 1; //大于2.5个
WiccApi.FOOTBALL_TOTAL_1 = 2; //小于2.5个

//足彩单双投注方案
WiccApi.FOOTBALL_ODD_EVEN_ODD = 1; //单
WiccApi.FOOTBALL_ODD_EVEN_EVEN = 2; //双

//足彩半全场投注方案
WiccApi.FOOTBALL_HALF_GOAL = 1; //进球
WiccApi.FOOTBALL_HALF_NO_GOAL = 2; //没有进球

//篮彩玩法
WiccApi.PLAY_BASKETBALL_SF = 1; //胜负
WiccApi.PLAY_BASKETBALL_RSF = 2; //让分胜负
WiccApi.PLAY_BASKETBALL_TOTAL_SCORE = 3; //总得分
WiccApi.PLAY_BASKETBALL_ODD_EVEN = 4; //单双

//篮彩胜负投注方案
WiccApi.BASKETBALL_SF_WIN = 1; //胜
WiccApi.BASKETBALL_SF_LOSE = 2; //负

//篮彩让分胜负投注方案
WiccApi.BASKETBALL_RSF_WIN = 1; //胜
WiccApi.BASKETBALL_RSF_LOSE = 2; //负

//篮彩总得分投注方案
WiccApi.BASKETBALL_TOTAL_SCORE_GREATER = 1; //大于215.5分
WiccApi.BASKETBALL_TOTAL_SCORE_LESS = 2; //小于215.5分

//篮彩单双投注方案
WiccApi.BASKETBALL_ODD_EVEN_ODD = 1; //单
WiccApi.BASKETBALL_ODD_EVEN_EVEN = 2; //双

module.exports = WiccApi;
