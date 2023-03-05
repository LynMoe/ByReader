const db = require('./db')
require('./cache')

;(async () => {
  await db.init()

  require('./api')
})()
