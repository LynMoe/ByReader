const NodeCache = require('node-cache')

class Cache {
  constructor (options = {}) {
    this.cache = new NodeCache(options)
  }

  get (key) {
    return this.cache.get(key)
  }

  mget (keys) {
    return this.cache.mget(keys)
  }

  set (key, value, ttl) {
    this.cache.set(key, value, ttl)
  }

  mset (values, ttl) {
    this.cache.mset(values, ttl)
  }
}

module.exports = Cache
