const koaRouter = require('koa-router')
const validator = require('validator')
const config = require('./../util/config')
const comic = require('../model/comic')
const image = require('../model/image')
const { comicQueue } = require('./../util/queue')
const comicCache = require('./../cache')('api-comic')
const logger = require('./../util/log').child({ module: 'API-Comic' })

async function queueRequest(fn, err, finallyFn) {
  return new Promise((resolve, reject) => {
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
        resolve(result)
      }).catch((e) => {
        err(e)
        cb(e)
        reject(e)
      }).finally(() => {
        finallyFn()
      })
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

  return queueRequest(async () => {
    let result
    const key = encodeURIComponent(`search-${siteId}-${keyword}-${page}`)
    if (comicCache.has(key)) {
      result = comicCache.get(key)
    } else {
      result = await comic.searchComic(siteId, keyword, page)
      comicCache.set(key, result)
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

router.get('/comic', async (ctx, next) => {
  let { comicId, comicIds } = ctx.query

  if ((!comicId || !comicIds) && (!comicId && !comicIds)) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  return queueRequest(async () => {
    let result

    if (comicIds) {
      comicIds = `${comicIds}`.split(',').map(i => i.trim())
      result = await Promise.all(comicIds.map(async (comicId) => {
        const key = encodeURIComponent(`comic-${comicId}`)
        if (comicCache.has(key)) {
          return Promise.resolve(comicCache.get(key))
        }

        return comic.getComicInfo(comicId).then((result) => {
          comicCache.set(key, result)
          return result
        })
      }))
    } else {
      const key = encodeURIComponent(`comic-${comicId}`)
      if (comicCache.has(key)) {
        result = comicCache.get(key)
      } else {
        result = await comic.getComicInfo(comicId)
        comicCache.set(key, result)
      }
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

  return queueRequest(async () => {
    const key = encodeURIComponent(`chapter-${comicId}`)
    let result
    if (comicCache.has(key)) {
      result = comicCache.get(key)
    } else {
      result = await comic.getChapterList(comicId)
      comicCache.set(key, result)
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

router.get('/chapter/detail', async (ctx, next) => {
  const { comicId, chapterId } = ctx.query

  if (!comicId || !chapterId) {
    ctx.body = {
      code: 400,
      message: 'Missing required parameters',
    }
    return
  }

  return queueRequest(async () => {
    const key = encodeURIComponent(`chapter-detail-${comicId}-${chapterId}`)
    let result
    if (comicCache.has(key)) {
      result = comicCache.get(key)
    } else {
      result = await comic.getChapterDetail(comicId, chapterId)
      comicCache.set(key, result)
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

router.get('/image', async (ctx, next) => {
  const { url } = ctx.query

  // todo: url should be checked inside comic provider
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

  return queueRequest(async () => {
    let imageBuffer = await image.getImage(url, accept.replace('image/', '')) // Cached inside
    
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
