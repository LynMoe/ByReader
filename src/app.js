const db = require('./util/db')
require('./cache')

;(async () => {
  await db.initClient()

  require('./api')
})()
