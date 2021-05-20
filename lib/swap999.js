const fs = require('fs')
const fse = require('fs-extra')
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
      }, 20 * 1000)
    }
  }

  async getSpiderAbility() {
    let tokenObject = await this.getAllTokenInfoWithCache()

    if (!tokenObject || 0 !== tokenObject.code || !tokenObject.data) {
      console.error(`Error: get ${this._platform} token list error.`)
      return []
    }

    const d = []
    if (typeof tokenObject.data === 'object' && !Array.isArray(tokenObject.data)) {
      for (var i in tokenObject.data) {
        d.push(tokenObject.data[i])
      }
      tokenObject.data = d
    }


    const tokensArray = tokenObject.data.reduce((p, n) => {
      const tokenName = n.symbol.toLocaleLowerCase().split('-')[0]
      p.push(tokenName)
      return p
    }, [])

    return tokensArray
  }

  /**
   * @param tokenName {string}
   * @returns {Promise<[number, number]|*[]>}
   */
  async getTokenPrice(tokenName) {
    let tokenObject = await this.getAllTokenInfoWithCache()

    if (!tokenObject || 0 !== tokenObject.code || !tokenObject.data) {
      tokenObject = {data: []}
    }

    const d = []
    if (typeof tokenObject.data === 'object' && !Array.isArray(tokenObject.data)) {
      for (var i in tokenObject.data) {
        d.push(tokenObject.data[i])
      }
      tokenObject.data = d
    }

    const tokenObj = tokenObject.data.find(obj => {
      if (obj.symbol.toLocaleLowerCase() === `${tokenName}-usdt`) {
        return true
      }
      return false
    })

    const yesterdayPrice = await this._getYesterdayPrice(tokenName)
    const ratio = yesterdayPrice === undefined ? 0 : ((tokenObj.price - yesterdayPrice) / yesterdayPrice * 100).toFixed(2)

    if (tokenObj) {
      return [tokenObj.price, ratio]
    }

    return [undefined, undefined]
  }

  async _getYesterdayPrice(tokenName) {
    const filepath = path.join(__dirname, '..', 'data', `${this._platform}${date('mmdd', new Date(new Date().getTime() - 3600 * 24 * 1000))}`)
    await fse.ensureFile(filepath)
    if (!this._yesterdayData || this._yesterdayData.filepath !== filepath) {
      this._yesterdayData = {}
      this._yesterdayData.filepath = filepath
      try {
        this._yesterdayData.data = await fs.readFileSync(filepath, 'utf8')
        this._yesterdayData.data = JSON.parse(this._yesterdayData.data)
      } catch(e) {
        return undefined
      }
    }

    if (!this._yesterdayData || !this._yesterdayData.data || !this._yesterdayData.data.data) {
      return undefined
    }

    const d = []
    if (typeof this._yesterdayData.data.data === 'object' && !Array.isArray(this._yesterdayData.data.data)) {
      for (var i in this._yesterdayData.data.data) {
        d.push(this._yesterdayData.data.data[i])
      }
      this._yesterdayData.data.data = d
    }



    const tokenObj = this._yesterdayData.data.data.find(obj => {
      if (obj.symbol.toLocaleLowerCase() === `${tokenName}-usdt`) {
        return true
      }
      return false
    })
    return tokenObj.price
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
    await fse.ensureFile(filepath)
    fs.writeFileSync(filepath, data)
  }

  async getAllTokenInfoWithCache() {
    const useCache = this._lastQueryTime  && ((new Date().getTime() - this._lastQueryTime) > this._cacheTime * 1000)
    if (this._tokenInfos && useCache) {
      return this._tokenInfos
    }

    this._lastQueryTime = new Date().getTime()
    return await this.getAllTokenInfo()
  }
}

exports.Swap999 = Swap999
