const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

async function loadConfig() {
  try {
    const yamlFilePath = path.join(__dirname, '..', 'config.yaml')
    let fileContents = await fs.readFileSync(yamlFilePath, 'utf8')
    let config = yaml.load(fileContents)
    return config
  } catch (e) {
    console.log(e)
    throw 'Yaml config file format error.'
  }
}

exports.loadConfig = loadConfig
