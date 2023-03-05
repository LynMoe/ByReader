const fs = require('fs')
const path = require('path')

const envName = (`${process.env.NODE_ENV || 'dev'}`).toLowerCase()

if (!['dev', 'prod'].includes(envName)) {
  throw new Error(`Invalid NODE_ENV value: ${envName}`)
}

const configFilename = path.resolve(__dirname, '../../config', `${envName}.json`)
if (!fs.existsSync(configFilename)) {
  throw new Error(`Missing config file for environment: ${envName}`)
}

function getConfig(key, defaultValue = undefined) {
  const keys = key.split('.')
  let value = getConfig.config
  for (let i = 0; i < keys.length; i++) {
    if (value[keys[i]] === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue
      } else {
        throw new Error(`Missing config key: ${key}`)
      }
    }
    value = value[keys[i]]
  }
  return value
}

getConfig.config = Object.assign({}, JSON.parse(fs.readFileSync(configFilename)))

getConfig.update = function(config) {
  getConfig.config = Object.assign({}, getConfig.config, config)
}

module.exports = getConfig
