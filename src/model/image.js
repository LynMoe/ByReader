const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const crypto = require('crypto')

const cache = require('../cache')
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

async function getImage(_url, format, quality = config('system.image.quality')) {
  // let key = crypto.createHash('sha256').update(JSON.stringify(`${site}:${url}:${url}`)).digest('hex')
  // let image
  // if (cache.get(key)) {
  //   image = fs.readFileSync()
  // }

  let image = await comic.getImage(_url)

  // TODO: cache image

  return await compressImage(image, format, quality)
}

module.exports = {
  compressImage,
  getImage,
}
