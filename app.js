const { Wechaty } = require('wechaty')
const { WechatRobot } = require('./wechatRobot')
const { YamlAuthChecker } = require('./authChecker/yamlAuthChecker')

// one message parser
const { TextParser } = require('./messageParser/textParser')

// two spider
const { MdexSpider } = require('./spider/mdexSpider')
const { PancakeSpider } = require('./spider/pancakeSpider')
const { UniSpider } = require('./spider/uniswapSpider')
const { HuobiSpider } = require('./spider/huobiSpider')

// 微信配置
const options = {
  puppet: 'wechaty-puppet-wechat',
  name: 'login-token'
}

const mdexSpider = new MdexSpider()
const pancakeSpider = new PancakeSpider()
const uniSpider = new UniSpider()
const huobiSpider = new HuobiSpider()
const wechatRobot = new WechatRobot({
  authChecker: new YamlAuthChecker(),
  msgParser: new TextParser(),
  // spiderList: [mdexSpider]
  // spiderList: [mdexSpider, pancakeSpider, uniSpider]
  spiderList: [mdexSpider, pancakeSpider, uniSpider, huobiSpider]
})

Wechaty.instance(options)
  .on('scan', wechatRobot.getQRCode)
  .on('login', user => {
    wechatRobot.login(user)
  })
  .on('logout', user => {
    wechatRobot.logout(user)
  })
  .on('message', message => {
    console.log(message)
    wechatRobot.msgHander(message)
  })
  .start()

process.on('uncaughtException', function (err) {
  console.log('uncaughtException:' + err.stack)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

