const express = require('express')
// const { MdexSpider } = require('./spider/mdexSpider')
// const { PancakeSpider } = require('./spider/pancakeSpider')
// const { UniSpider } = require('./spider/uniswapSpider')
const { HuobiSpider } = require('./spider/huobiSpider')


// dex的这几个蜘蛛，会自动记录到文件里面去
// const mdexSpider = new MdexSpider()
// const pancakeSpider = new PancakeSpider()
// const uniSpider = new UniSpider()

// TODO：目前只需要huobi的
const huobiSpider = new HuobiSpider()

const app = express()
app.get('/coin/getCoinPrice', async (req, res) => {
  const coins = req.params.coins.split(',')

  const prices = []
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i]
    const d = await huobiSpider.getTokenPrice(coin)
    prices.push(d)
  }

  res.send(prices)
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

process.on('uncaughtException', function (err) {
  console.log('uncaughtException:' + err.stack)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

