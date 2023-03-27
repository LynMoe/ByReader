const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const fse = require('fs-extra')

const config = require('../util/config')

class FileCache {
  constructor() {
    this.maxSize = config('system.fileCache.maxSize', 1024) * 1024 * 1024 // MB
    this.maxFileSize = config('system.fileCache.maxFileSize', 10) * 1024 * 1024 // MB
    this.cachePath = path.resolve(__dirname, '../../', config('system.fileCache.path', 'cache'))
    this.cache = new Map()
    this.currentSize = 0

    fse.ensureDirSync(this.cachePath)
    fse.emptyDirSync(this.cachePath)
  }

  _hashKey(key) {
    return crypto.createHash('sha1').update(key).digest('hex')
  }

  async _removeOldestEntry() {
    const oldestKey = Array.from(this.cache.keys())[0]
    const oldestEntry = this.cache.get(oldestKey)
    await fs.promises.unlink(oldestEntry.filePath)
    this.currentSize -= oldestEntry.size
    this.cache.delete(oldestKey)
  }

  async cacheFile(key, buffer) {
    if (buffer.length > this.maxFileSize) {
      return
    }

    const hashedKey = this._hashKey(key)
    const filePath = path.resolve(this.cachePath, hashedKey)

    while (this.currentSize + buffer.length > this.maxSize) {
      await this._removeOldestEntry()
    }

    await fs.promises.writeFile(filePath, buffer)
    this.cache.set(hashedKey, { filePath, size: buffer.length })
    this.currentSize += buffer.length
  }

  async getCacheFile(key) {
    const hashedKey = this._hashKey(key)
    const entry = this.cache.get(hashedKey)

    if (entry) {
      this.cache.delete(hashedKey)
      this.cache.set(hashedKey, entry)
      return await fs.promises.readFile(entry.filePath)
    }

    return null
  }
}

module.exports = FileCache()
