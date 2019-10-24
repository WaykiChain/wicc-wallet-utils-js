var WiccApi = require('./src/lib/wiccapi')
var bitcore = require('./src')
WiccApi = Object.assign(WiccApi, bitcore)

module.exports = WiccApi