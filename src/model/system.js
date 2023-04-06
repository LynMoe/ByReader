const config = require('./../util/config')
const packageJson = require('./../../package.json')

async function getSystemInfo() {
  return {
    name: config('system.name'),
    apiBase: config('system.apiBase'),

    version: packageJson.version,
  }
}

module.exports = {
  getSystemInfo,
}
