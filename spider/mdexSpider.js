var request = require('request');

class MdexSpider {

  // Return spider's name
  async getSpiderName() {
    return 'mdex'
  }

  // Result is a list of coins.
  // like ['mdx', 'ht', 'lhb', 'filda']
  async getSpiderAbility() {
    const d = await this._getMdexData()
    console.log(d)
  }

  // Private, get all mdex supported token!
  _getMdexData() {
    return new Promise((resolve) => {
      request('https://gateway.mdex.cc/v2/mingpool/lps?mdex_chainid=128', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            const result = JSON.parse(body)
            return result
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

}

exports.MdexSpider = MdexSpider
