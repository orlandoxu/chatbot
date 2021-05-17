const fse = require('fs-extra')
const path = require('path')

(!async function writeJson() {
  const filepath = path.join(__dirname, '..', 'data', 'test', 'json')
  await fse.ensureFile(filepath)
  await fse.writeJson([])




})()
