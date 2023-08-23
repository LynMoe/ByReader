const NodeCache = require('./nodecache')
const config = require('./../util/config')

const cacheType = {
  NodeCache,
}

const configType = config('cache.type', 'NodeCache')
if (!cacheType[configType]) throw new Error(`Cache provider ${configType} not found`)

module.exports = function cacheBuilder(name) {
  const cache = new cacheType[configType](config(`cache.${configType}`))
  return cache
}
