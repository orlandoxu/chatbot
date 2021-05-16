const request = require('request');


class Swap999 {
  constructor({platform, cacheTime}) {
    this._cacheTime = cacheTime || 10
    // 还支持，pancakeswap，uniswap
    this._platform = platform || 'mdex'
  }

  async getSpiderAbility() {
    const tokenObject = await this.getAllTokenInfoWithCache()

    if (!tokenObject || 0 !== tokenObject.code || !tokenObject.data) {
      console.error(`Error: get ${this._platform} token list error.`)
      return []
    }

    const tokensArray = tokenObject.data.reduce((p, n) => {
      const tokenName = n.symbol.toLocaleLowerCase().split('-')[0]
      p.push(tokenName)
      return p
    }, [])

    return tokensArray
  }

  async getTokenPrice(tokenName) {
    let tokenObject = await this.getAllTokenInfoWithCache()

    if (!tokenObject || 0 !== tokenObject.code || !tokenObject.data) {
      tokenObject = {data: []}
    }

    const tokenObj = tokenObject.data.find(obj => {
      if (obj.symbol.toLocaleLowerCase() === `${tokenName}-usdt`) {
        return true
      }
      return false
    })

    if (tokenObj) {
      return tokenObj.price
    }

    return undefined
  }

  getAllTokenInfo() {
    const self = this
    return new Promise((resolve) => {
      request('https://swap999.com/record/currentprice/?platform=' + this._platform, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            const result = JSON.parse(body)

            self._tokenInfos = result
            resolve(self._tokenInfos)
            return
          } catch (e) {
            console.error('Error: mdex spider request error. Body unreadable.')
            resolve([])
          }
          return
        }

        console.error('Error: mdex spider request error. Http status is not 200.')
        resolve([])
      });
    })
  }

  async getAllTokenInfoWithCache() {
    const useCache = this._lastQueryTime  && (this._lastQueryTime - (new Date().getTime()) > this._cacheTime * 1000)
    if (this._tokenInfos && useCache) {
      return this._tokenInfos
    }

    this._lastQueryTime = new Date().getTime()
    return await this.getAllTokenInfo()
  }
}

exports.Swap999 = Swap999
