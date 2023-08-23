const config = require('./../util/config')
const logger = require('./../util/log').child({ module: 'API' })
const Koa = require('koa')
const app = new Koa()
const cors = require('@koa/cors')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cookie = require('koa-cookie').default

const cache = require('./../cache')('api-index')
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
  let token = ctx.headers['x-token']
  if (!token) {
    token = ctx.query.token
  }

  const cacheToken = `token:${token}`
  let username
  if (token) {
    if (username = cache.get(cacheToken)) {
      ctx.state.username = username
    } else {
      if ((username = await user.checkToken(token)) !== false) {
        cache.set(token, username, 60 * 60 * 2)
        ctx.state.username = username
      }
    }
  }

  if (!ctx.state.username) {
    if ([
      '/user/login',
      '/user/register',
    ].includes(ctx.path)) {
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

app.listen(config('koa.port'))
logger.info(`Koa server listening on port ${config('koa.port')}`)
