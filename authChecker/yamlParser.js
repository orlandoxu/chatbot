const fs = require('fs')
const yaml = require('js-yaml')

function loadConfig() {
  try {
    let fileContents = fs.readFileSync('../config.yaml', 'utf8')
    let config = yaml.safeLoad(fileContents)
    return config
  } catch (e) {
    throw 'Yaml config file format error.'
  }
}

exports.loadConfig = loadConfig
