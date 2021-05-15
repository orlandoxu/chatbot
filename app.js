const { Wechaty } = require('wechaty')
const { WechatRobot } = require('./wechatRobot')
const { YamlAuthChecker } = require('./authChecker/yamlAuthChecker')

// one message parser
const { TextParser } = require('./messageParser/textParser')

// two spider
const { MdexSpider } = require('./spider/mdexSpider')
const { PancakeSpider } = require('./spider/pancakeSpider')

// 微信配置
const options = {
  puppet: 'wechaty-puppet-wechat',
  name: 'login-token'
}

const mdexSpider = new MdexSpider()
const pancakeSpider = new PancakeSpider()
const wechatRobot = new WechatRobot({
  authChecker: new YamlAuthChecker(),
  msgParser: TextParser,
  spiderList: [mdexSpider, pancakeSpider]
})

Wechaty.instance(options)
  .on('scan', wechatRobot.getQRCode)
  .on('login', wechatRobot.login)
  .on('logout', wechatRobot.logout)
  .on('message', wechatRobot.msgHander)
  .start()
