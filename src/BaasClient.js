const axios = require('axios');
var _ = require('lodash');

class BaasClient {
    constructor(BaaSUrl) {
        this.BaaSUrl = BaaSUrl
        if (!_.trim(this.BaaSUrl).length) {
            throw ('BaaSUrl is required')
        }
        this.instance = axios.create({
            baseURL: BaaSUrl,
            timeout: 15 * 1000
        });
        this.instance.interceptors.response.use(function (response) {
            if (response.data.code === 0) {
                return response.data
            } else {
                return Promise.reject(response.data.msg);
            }
        }, function (error) {
            return Promise.reject(error);
        })
    }
    async getAccountInfo(address) {
        let res = await this.instance.post("/account/getaccountinfo", {
            address: address
        })
        return res
    }
    async getBlockCount() {
        let res = await this.instance.post("/block/getblockcount")
        return res
    }
    async sendRawTx(rawtx) {
        let res = this.instance.post("/transaction/sendrawtx", {
            rawtx: rawtx
        })
        return res
    }
    async decodeRawTx(rawtx) {
        let res = this.instance.post("/transaction/decoderawtx", {
            rawtx: rawtx
        })
        return res
    }
}

module.exports = BaasClient