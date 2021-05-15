// This is a auth checker with yaml file.
// U can build yourself checker.

const { loadConfig } = require('./yamlParser')

class YamlAuthChecker {
  // If u want to check the Message's doc
  // Visit: https://github.com/wechaty/wechaty
  async checkMessagesAuth(message) {
    const talker = message.talker()
    const room = message.room()
    const isFriend = talker.friend()
    if (!this._config) {
      this._config = await loadConfig()
    }

    const isInRoomBlackList = await this._checkInRoomBlackList(room)
    if (isInRoomBlackList) {
      return false
    }

    const isInUserBlackList = await this._checkInUserBlackList(talker)
    if (isInUserBlackList) {
      return false
    }

    const config = this._config
    switch (config.model) {
      case 'friendOnly':
        if (isFriend && !room) {
          return true;
        }
        return false
        break
      case 'groupOnly':
        if (room) {
          return true
        }
        return false
        break
      case 'all':
        return true
      case 'friend4Group':
      default:
        if (isFriend) {
          return true;
        }
        return false
        break
    }
  }

  async _checkInRoomBlackList(room) {
    const topic = await room.topic()
    const alias = await room.alias()

    const config = this._config
    if (!config || !config.groupBlackList) {
      return false
    }

    if (config.groupBlackList.name && config.groupBlackList.name.includes(topic)) {
      return true
    }

    if (config.groupBlackList.alias && config.groupBlackList.alias.includes(alias)) {
      return true
    }

    return false
  }

  async _checkInUserBlackList(user) {
    const name = await user.name()
    const alias = await user.alias()

    const config = this._config
    if (!config || !config.userBlackList) {
      return false
    }

    if (config.userBlackList.name && config.userBlackList.name.includes(name)) {
      return true
    }

    if (config.userBlackList.alias && config.userBlackList.alias.includes(alias)) {
      return true
    }

    return false
  }
}

exports.YamlAuthCheck = YamlAuthChecker
