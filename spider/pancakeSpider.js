const request = require('request');
const { Swap999 } = require('../lib/swap999')

// It's hard to get price from mdex. So...
// Get price from swap999
class PancakeSpider {
  constructor() {
    this._spiderProxy = new Swap999({
      platform: 'pancake'
    })
  }

  // Return spider's name
  async getSpiderName() {
    return 'pan'
  }

  /**
   * @returns {Promise<string[]>}
   */
  async getSpiderAbility() {
    return await this._spiderProxy.getSpiderAbility()
  }

  /**
   * @param token: string
   * @returns {Promise<number>}
   */
  async getTokenPrice(token) {
    return await this._spiderProxy.getTokenPrice([token])
  }
}


exports.PancakeSpider = PancakeSpider
