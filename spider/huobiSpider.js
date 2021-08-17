const request = require('request');

class HuobiSpider {
  constructor() {
  }

  // Return spider's name
  async getSpiderName() {
    return 'huobi'
  }

  /**
   * @returns {Promise<string[]>}
   */
  async getSpiderAbility() {
    const data = await this._getAllTokenPrice()
    const allTokens = data.reduce((p, n) => {
      if (/usdt$/.test(n.symbol)) {
        p.push(n.symbol.substr(0, n.symbol.length - 4))
      }

      return p
    }, [])

    return allTokens
  }

  /**
   * @param token: string
   * @returns {Promise<number>}
   */
  async getTokenPrice(token) {
    const allTokenPrice = await this._getAllTokenInfoWithCache()
    const tokenObj = allTokenPrice.find(v => {
      return v.symbol.toLocaleLowerCase() === `${token}usdt`
    })

    if (!tokenObj) {
      return [undefined, undefined]
    }

    return [tokenObj.ask, ((tokenObj.ask - tokenObj.open) / tokenObj.ask * 100).toFixed(2)]
  }

  _getAllTokenPrice() {
    const self = this
    return new Promise((resolve) => {
      const headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
      }

      const opt = {
        // url: 'https://api.huobi.pro.cdn.cloudflare.net/market/tickers',
        url: 'https://api.huobi.pro/market/tickers',
        method: 'GET',
        headers: headers,
      }

      request(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            const result = JSON.parse(body)
            if (result.status !== 'ok') {
              resolve([])
              return
            }

            self._tokenInfos = result.data
            resolve(self._tokenInfos)
            return
          } catch (e) {
            console.error('Error: huobi spider request error. Body unreadable.')
            resolve([])
          }
          return
        }

        console.error('Error: huobi spider request error. Http status is not 200.')
        resolve([])
      });
    })
  }

  async _getAllTokenInfoWithCache() {
    const useCache = this._lastQueryTime  && ((new Date().getTime() - this._lastQueryTime) > 60 * 1000)
    if (this._tokenInfos && useCache) {
      return this._tokenInfos
    }

    this._lastQueryTime = new Date().getTime()
    return await this._getAllTokenPrice()
  }
}

exports.HuobiSpider = HuobiSpider
