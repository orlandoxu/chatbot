const fs = require('fs')
const path = require('path')
const request = require('request');
const { date } = require('../lib/tools')

class Swap999 {
  constructor({platform, cacheTime, writeFile}) {
    this._cacheTime = cacheTime || 10
    // 还支持，pancakeswap，uniswap
    this._platform = platform || 'mdex'
    this._writeFile = writeFile || false

    if (this._write2File) {
      setInterval(() => {
        this.getAllTokenInfo()
      }, 10 * 1000)
    }
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
            self._write2File(self._tokenInfos)
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

  async _write2File(data) {
    if (!this._writeFile) {
      return
    }

    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }

    const filepath = path.join(__dirname, '..', 'data', `${this._platform}${date('mmdd', new Date())}`)
    fs.writeFileSync(filepath)
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
