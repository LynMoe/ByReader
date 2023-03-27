const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const cache = require('../util/fileCache')
const comic = require('./comic')
const config = require('../util/config')

const cachePath = path.resolve(__dirname, '../../', config('system.cache.path'))

async function compressImage(image, format, quality = config('system.image.quality')) {
  fs.writeFileSync(path.resolve(cachePath, 'test.jpg'), image)
  const buffer = await sharp(Buffer.from(image))
    .toFormat(format, { quality })
    .toBuffer()

  return buffer
}

async function getImage(_url, format) {
  let image
  if (config('system.fileCache.enable', false)) {
    image = await cache.getCacheFile(_url)
  }

  if (!image) {
    image = await comic.getImage(_url)
    if (config('system.fileCache.enable', false)) {
      await cache.cacheFile(_url, image)
    }
  }

  return await compressImage(image, format)
}

module.exports = {
  compressImage,
  getImage,
}
