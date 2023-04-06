const koaRouter = require('koa-router')
const validator = require('validator')
const config = require('./../util/config')
const comic = require('../model/comic')
const image = require('../model/image')
const { comicQueue } = require('./../util/queue')

async function queueRequest(fn, err, finallyFn) {
  comicQueue.push(function(cb) {
    return Promise.race([
      fn(),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'))
        }, config('queue.comic.timeout', 10000))
      })
    ]).then((result) => {
      cb(null, result)
    }).catch((e) => {
      err(e)
      cb(e)
    }).finally(() => {
      finallyFn()
    })
  })
}

const router = new koaRouter({
  prefix: '/comic',
})

router.get('/site', async (ctx, next) => {
  ctx.body = {
    code: 200,
    message: 'Success',
    result: comic.getSiteList(),
  }

  await next()
})

router.get('/search', async (ctx, next) => {
  const { siteId, keyword, page } = ctx.query

  if (!siteId || !keyword || !page) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  queueRequest(async () => {
    const result = await comic.searchComic(siteId, keyword, page)
    ctx.body = {
      code: 200,
      message: 'Success',
      result: result,
    }
  }, (e) => {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }, next)
})

router.get('/comic', async (ctx, next) => {
  let { comicId, comicIds } = ctx.query

  if ((!comicId || !comicIds) && (!comicId && !comicIds)) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  queueRequest(async () => {
    let result

    if (comicIds) {
      comicIds = `${comicIds}`.split(',').map(i => i.trim())
      result = await Promise.all(comicIds.map((comicId) => comic.getComicInfo(comicId)))
    } else {
      result = await comic.getComicInfo(comicId)
    }

    ctx.body = {
      code: 200,
      message: 'Success',
      result: result,
    }
  }, (e) => {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }, next)
})

router.get('/chapter', async (ctx, next) => {
  const { comicId } = ctx.query

  if (!comicId) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  queueRequest(async () => {
    const result = await comic.getChapterList(comicId)
    ctx.body = {
      code: 200,
      message: 'Success',
      result: result,
    }
  }, (e) => {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }, next)
})

router.get('/chapter/detail', async (ctx, next) => {
  const { comicId, chapterId } = ctx.query

  if (!comicId || !chapterId) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  queueRequest(async () => {
    const result = await comic.getChapterDetail(comicId, chapterId)
    ctx.body = {
      code: 200,
      message: 'Success',
      result: result,
    }
  }, (e) => {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }, next)
})

router.get('/image', async (ctx, next) => {
  const { url } = ctx.query

  if (!url || !validator.isURL(url.split(':').splice(1).join(':'))) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  let accept = 'image/jpeg'
  if (ctx.accepts('image/avif')) {
    accept = 'image/avif'
  } else if (ctx.accepts('image/webp')) {
    accept = 'image/webp'
  }

  queueRequest(async () => {
    let imageBuffer = await image.getImage(url, accept.replace('image/', ''))
    
    ctx.set('Content-Type', accept)
    ctx.set('Cache-Control', 'max-age=31536000')
    ctx.set('Expires', new Date(Date.now() + 31536000000).toUTCString())
    
    ctx.body = imageBuffer
  }, (e) => {
    ctx.body = {
      code: 500,
      message: e.message,
    }
  }, next)
})

module.exports = router.routes()
