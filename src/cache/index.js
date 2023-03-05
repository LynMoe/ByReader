const NodeCache = require('./nodecache')
const config = require('./../util/config')

const cacheType = {
  NodeCache,
}

const configType = config('system.cache.type')

if (!cacheType[configType]) throw new Error(`Cache provider ${configType} not found`)
const cache = new cacheType[configType](config(`system.cache.${configType}`))

module.exports = cache
