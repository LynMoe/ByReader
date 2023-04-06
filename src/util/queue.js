const config = require('./config')
const queue = require('queue')

const comicQueue = queue({
  concurrency: config('queue.comic.concurrency'),
  autostart: true,
  timeout: config('queue.comic.timeout', 10000) + 1000,
})

module.exports = {
  comicQueue
}
