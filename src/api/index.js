const config = require('./../util/config')
const logger = require('./../util/log').child({ module: 'API' })
const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cookie = require('koa-cookie').default

const cache = require('./../cache')
const user = require('./../model/user')

app.use(cors())
app.use(cookie())
app.use(bodyParser())
app.use(koaLogger({
  transporter: (str) => {
    logger.info(str)
  }
}))

app.use(async (ctx, next) => {
  // const combinedId = ctx.cookies.get('combinedId')
  const combinedId = ctx.headers['x-combined-id']

  if (combinedId) {
    if (cache.get(combinedId)) {
      ctx.state.combinedId = combinedId
    } else {
      if (await user.checkCombinedId(combinedId)) {
        cache.set(combinedId, 1, 60 * 60 * 2)
        ctx.state.combinedId = combinedId
      }
    }
  }

  if (!ctx.state.combinedId) {
    if (ctx.path === '/user/getCombindedId') {
      await next()
    } else {
      ctx.body = {
        code: 401,
        message: 'Unauthorized',
      }
    }
    return
  }

  await next()
})

app.use(require('./user'))
app.use(require('./comic'))

app.listen(config('system.koa.port'))
logger.info(`Koa server listening on port ${config('system.koa.port')}`)
