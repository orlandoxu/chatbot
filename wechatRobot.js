const qrTerminal = require('qrcode-terminal')
const { date } = require('./lib/tools')

class WechatRobot {
  // private member
  //    _msgParser   -   A wechat message parser
  //    _spiderList  -   Spiders
  //    _user        -   Login user
  //    _coin2SpiderMap    -   _coin2SpiderMap
  //        ltc => { 'mdex': spiderMdex }

  constructor({spiderList, msgParser, authChecker}) {
    this._msgParser = msgParser
    this._spiderList = spiderList
    this._authChecker = authChecker
    this._coin2SpiderMap = null
  }


  login(user) {
    console.log(`User ${user.id} logged in`)
    this._user = user
  }

  logout(user) {
    console.log(`User ${user.id} logged out`)
    delete this._user
  }

  getQRCode(qrcode, status) {
    // 在console端显示二维码
    qrTerminal.generate(qrcode);
  }

  async _initSpider4CoinList() {
    this._coin2SpiderMap = this._coin2SpiderMap || {}
    for (let i = 0; i < this._spiderList.length; i++) {
      const spiderName = await this._spiderList[i].getSpiderName()

      const coinArr = await this._spiderList[i].getSpiderAbility()
      if (!coinArr || coinArr.length === 0) {
        continue
      }

      coinArr.forEach((item, idx) => {
        this._coin2SpiderMap[item] = this._coin2SpiderMap[item] || {}
        this._coin2SpiderMap[item][spiderName] = this._spiderList[i]
      })
    }

    // Add all tokens to message parser
    this._msgParser.watch(Object.keys(this._coin2SpiderMap))
  }

  async msgHander(message) {
    // Step 1. Check login
    if (!this._user) {
      return false
    }

    // Step 2. Make sure ability is done
    if (!this._coin2SpiderMap) {
      await this._initSpider4CoinList()
    }

    // const talker = message.talker()
    // if (talker.id === this._user.id) {
    //   return false
    // }

    // Step 3. Parse the message
    const msgObject = this._msgParser.messageParse(message.text())
    if (!msgObject) {
      return
    }

    // Step 4. Check user's auth
    const hasAuth = await this._authChecker.checkMessagesAuth(message)
    if (!hasAuth) {
      return false
    }

    // Can not recall a message, cause web plugin doesn't supported!
    const [recall, options, coinList] = msgObject
    if (!options.includes('-s') && !options.includes('--search')) {
      return false
    }
    if (options.includes('-h') || options.includes('--help')) {
      this._showHelp(message)
    }

    // Step 5. Get the price and make the message
    const coinItems = await this._getTokenPrices(coinList)
    const msgText = await this._makeTokenPrice(coinItems)
    message.say(msgText)
  }

  /**
   * @param coinItem {CoinItem[]}
   * @returns {Promise<void>}
   * @private
   */
  async _makeTokenPrice(coinItem) {
    let msg = `${date('时间：HH:MM', new Date())}`
    for (let i = 0; i < coinItem.length; i++) {
      const coin = coinItem[i]
      msg = `${msg}\nToken：${coin.name}`
      coin.dex.forEach(v => {
        msg = `${msg}\n    [${v.dexName}]\t${v.price} \t[ratio]\t${v.ratio}%`
      })
    }

    return msg
  }

  /**
   * @param coinList {[]}
   * @returns {Promise<CoinItem[]>}
   * @private
   */
  async _getTokenPrices(coinList) {
    /**
     * @type {CoinItem[]}
     */
    const coinPriceArr = []
    for (let i = 0; i < coinList.length; i++) {
      const coinName = coinList[i]
      const spiderInfos = this._coin2SpiderMap[coinName]

      /**
       * @typedef {{dexName: string, price: number, ratio: number}} CoinDexObject
       * @typedef {{name: string, dex: [CoinDexObject]}} CoinItem
       * @type {CoinItem}
       */
      const coinItem = {name: coinName, dex: []}
      for (let spiderName in spiderInfos) {
        const spider = spiderInfos[spiderName]
        const [price, ratio] = await spider.getTokenPrice(coinName)
        coinItem.dex.push({
          dexName: spiderName, price: price, ratio: ratio
        })
      }
      coinPriceArr.push(coinItem)
    }

    return coinPriceArr
  }

  _showHelp(message) {
    const help = 'this is help'
    message.say(help)
  }

}

exports.WechatRobot = WechatRobot

