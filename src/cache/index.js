const NodeCache = require('./nodecache')
const config = require('./../util/config')

const cacheType = {
  NodeCache,
}

const configType = config('cache.type')

if (!cacheType[configType]) throw new Error(`Cache provider ${configType} not found`)
const cache = new cacheType[configType](config(`cache.${configType}`))

module.exports = cache
