const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const cache = require('../util/fileCache')
const comic = require('./comic')
const config = require('../util/config')
const logger = require('../util/log').child({ module: 'Model-Image' })

const cachePath = path.resolve(__dirname, '../../', config('fileCache.path'))

async function compressImage(image, format) {
  fs.writeFileSync(path.resolve(cachePath, 'test.jpg'), image)
  const options = config('image.' + 'format', {
    quality: 80,
  })

  const buffer = await sharp(Buffer.from(image))
    .toFormat(format, options)
    .toBuffer()

  return buffer
}

async function getImage(_url, format = 'webp') {
  logger.info('Get image' + _url + format)
  let image
  if (config('fileCache.enable', false)) {
    image = await cache.getCacheFile(_url + format)
    if (image) return image
  }

  logger.info('Image not found in cache, downloading' + _url)
  image = await comic.getImage(_url)
  logger.info('Downloaded image' + _url)
  image = await compressImage(image, format)
  logger.info('Compressed image' + _url)
  if (config('fileCache.enable', false)) {
    await cache.cacheFile(_url + format, image)
  }
  return image
}

module.exports = {
  compressImage,
  getImage,
}
