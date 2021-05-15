const qrTerminal = require('qrcode-terminal')

class WechatRobot {
  // private member
  //    _msgParser   -   A wechat message parser
  //    _spiderList  -   Spiders
  //    _user        -   Login user
  //    _coinList    -   CoinList
  //        ltc => { 'mdex': spiderMdex }

  constructor({spiderList, msgParser, authChecker}) {
    this._msgParser = msgParser
    this._spiderList = spiderList
    this._authChecker = authChecker
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
    for (let i = 0; i < this._spiderList.length; i++) {
      const spiderName = await this._spiderList[i].getSpiderName()

      const coinArr = await this._spiderList[i].getSpiderAbility()
      if (!coinArr || coinArr.length === 0) {
        continue
      }

      coinArr.forEach((item, idx) => {
        this._coinList[item] = this._coinList[item] || {}
        this._coinList[item][spiderName] = this._spiderList[i]
      })
    }
  }

  async msgHander(message) {
    if (!this._user) {
      return false
    }

    if (!this._coinList) {
      await this._initSpider4CoinList()
    }

    const talker = message.talker()

    // Ignore bot self message
    if (talker.id === this._user.id) {
      return false
    }

    // Check the message can parse or not first. cause it's not a async func.
    const msgObject = this._msgParser.messageParse(message.text())
    if (!msgObject) {
      return
    }

    // Check the user's auth
    const hasAuth = await this._authChecker.checkMessagesAuth(message)
    if (!hasAuth) {
      return false
    }

    const [cancelOrNot, checkCoinList] = msgObject
    const messageText = await this._makeCoinListResultText(checkCoinList)
    message.say(messageText)

    // console.log(`Message: ${message}`)
    // console.log(`Message talker: ${message.talker().id}`)
    // console.log(`Message to: ${message.to()}`)
    // console.log(`Message room: ${message.room()}`)
    // console.log(`Message age: ${message.age()}`)
    // if (message.text() === 'hello') {
    //   message.say('hellohello')
    // }
  }

  async _makeCoinListResultText(checkCoinList) {
    return 'xxxxxx'
  }

  _showHelp() {
    // Here's system's help function.
  }

}

exports.WechatRobot = WechatRobot

