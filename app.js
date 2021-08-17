const express = require('express')

// dex的这几个蜘蛛，会自动记录到文件里面去
const mdexSpider = new MdexSpider()
const pancakeSpider = new PancakeSpider()
const uniSpider = new UniSpider()

// TODO：目前只需要huobi的
const huobiSpider = new HuobiSpider()

const app = express()
app.get('/coin/getCoinPrice', async (req, res) => {
  const d = await huobiSpider.getTokenPrice('btc')
  res.send(d)
});


function listenServer() {
  appServer = app.listen(80, '0.0.0.0', 65535, function () {
    console.log('Express server listening on port ' + 80)
  })

  appServer.setTimeout(0)
  appServer.on('error', function (e) {
    if (e.code === 'EADDRINUSE') {
      console.error('address in use, retrying...')
      setTimeout(function () {
        if (appServer != null) {
          appServer.close()
        }
        listenServer()
      }, 3000)
    }
  })
}

listenServer();


const { WechatRobot } = require('./wechatRobot')
const { YamlAuthChecker } = require('./authChecker/yamlAuthChecker')

// two spider
const { MdexSpider } = require('./spider/mdexSpider')
const { PancakeSpider } = require('./spider/pancakeSpider')
const { UniSpider } = require('./spider/uniswapSpider')
const { HuobiSpider } = require('./spider/huobiSpider')

// const wechatRobot = new WechatRobot({
//   authChecker: new YamlAuthChecker(),
//   // spiderList: [mdexSpider]
//   // spiderList: [mdexSpider, pancakeSpider, uniSpider]
//   spiderList: [mdexSpider, pancakeSpider, uniSpider, huobiSpider]
// })

process.on('uncaughtException', function (err) {
  console.log('uncaughtException:' + err.stack)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

