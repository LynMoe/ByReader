const koaRouter = require('koa-router')
const validator = require('validator')
const comic = require('../model/comic')
const user = require('./../model/user')

const router = new koaRouter({
  prefix: '/user',
})

router.post('/getCombinedId', async (ctx, next) => {
  console.log(ctx.request.body)
  const { email, passcode } = ctx.request.body
  if (!email || !passcode) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  try {
    const result = await user.checkOrCreateUser(email, passcode)

    ctx.cookies.set('combinedId', result, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: false,
    })

    ctx.body = {
      code: 200,
      message: 'Success',
      result: result,
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }

  await next()
})

router.get('/bookshelf', async (ctx, next) => {
  const result = await user.getUserBookshelf(ctx.state.combinedId)

  ctx.body = {
    code: 200,
    message: 'Success',
    result: result,
  }

  await next()
})

router.post('/bookshelf', async (ctx, next) => {
  const { operation, bookshelfName, comicId } = ctx.request.body
  if (!operation || !bookshelfName || !comicId || (operation !== 'add' && operation !== 'remove')) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  try {
    if (operation === 'add') {
      await user.addBookToBookshelf(ctx.state.combinedId, bookshelfName, comicId)
    } else {
      await user.removeBookFromBookshelf(ctx.state.combinedId, bookshelfName, comicId)
    }

    ctx.body = {
      code: 200,
      message: 'Success',
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }

  await next()
})

router.get('/bookshelf/progress', async (ctx, next) => {
  const { comicId } = ctx.query
  if (!comicId) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  const result = await user.getReadingProgress(ctx.state.combinedId, comicId)

  ctx.body = {
    code: 200,
    message: 'Success',
    result: result,
  }

  await next()
})

router.post('/bookshelf/progress', async (ctx, next) => {
  const { comicId, chapterId } = ctx.request.body
  if (!comicId || !chapterId) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  await user.setReadingProgress(ctx.state.combinedId, comicId, chapterId)

  ctx.body = {
    code: 200,
    message: 'Success',
  }

  await next()
})

module.exports = router.routes()
