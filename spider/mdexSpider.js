const { Swap999 } = require('../lib/swap999')

// It's hard to get price from mdex. So...
// Get price from swap999
class MdexSpider {
  constructor() {
    this._spiderProxy = new Swap999({
      platform: 'mdex', writeFile: true
    })
  }

  // Return spider's name
  async getSpiderName() {
    return 'mdex'
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
    return await this._spiderProxy.getTokenPrice(token)
  }
}

exports.MdexSpider = MdexSpider
