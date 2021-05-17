const fse = require('fs-extra')
const path = require('path')

class CustomerFollow {
  async addTokens(userId, tokens) {
    const filepath = path.join(__dirname, '..', 'data', 'customer', userId)

    await fse.ensureFile(filepath)
    let userToken
    try {
      userToken = await fse.readJson(filepath)
    } catch(e) {
      userToken = []
    }

    userToken = userToken || []
    userToken = [...userToken, ...tokens.reduce((p, n) => {
      if (!userToken.includes(n)) {
        p.push(n)
      }

      return p
    }, [])]

    await fse.writeJson(filepath, userToken)
  }

  async delTokens(userId, tokens) {
    const filepath = path.join(__dirname, '..', 'data', 'customer', userId)

    await fse.ensureFile(filepath)
    let userToken
    try {
      userToken = await fse.readJson(filepath)
    } catch(e) {
      userToken = []
    }

    userToken = userToken || []
    userToken = userToken.reduce((p, n) => {
      if (!tokens.includes(n)) {
        p.push(n)
      }

      return p
    }, [])

    await fse.writeJson(filepath, userToken)
  }

  async getUserToken(userId) {
    const filepath = path.join(__dirname, '..', 'data', 'customer', userId)
    await fse.ensureFile(filepath)
    const userTokens = await fse.readJson(filepath)
    return userTokens || []
  }
}

exports.CustomerFollow = CustomerFollow
