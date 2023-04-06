const config = require('./config')
const NodeCache = require('node-cache')

const comicCache = new NodeCache({
  stdTTL: config('cache.comic.stdTTL', 60),
  checkperiod: 60,
})

module.exports = {
  comicCache,
}
