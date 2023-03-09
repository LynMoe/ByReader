const fs = require('fs')
const path = require('path')

const db = require('./../db')

const siteList = {}
{
  const sites = fs.readdirSync(path.resolve(__dirname, '../site'))
  for (const site of sites) {
    if (site.endsWith('.js') && !site.startsWith('.')) {
      const siteName = path.basename(site, '.js').toLocaleLowerCase()
      siteList[siteName] = require(path.resolve(__dirname, '../site') + '/' + site)
    }
  }
}

/*
  * @return [site, origin]
  */
function checkSite(string) {
  const split = `${string}`.split(':')
  const site = split.shift()
  if (!site || !siteList[site]) throw new Error('Site not found')

  return [site, split.join(':')]
}

function getSiteList() {
  return Object.keys(siteList).map(site => {
    return {
      id: site,
      name: siteList[site].name,
      icon: siteList[site].icon,
    }
  })
}

async function searchComic(siteId, keyword = '', page = 1) {
  checkSite(siteId)

  let result = await siteList[siteId].searchComic(keyword, page)
  result.list = result.list.map(item => {
    item.id = `${siteId}:${item.id}`
    item.cover = `${siteId}:${item.cover}`
    return item
  })

  return result
} 

async function getComicInfo(_comicId) {
  const [site, comicId] = checkSite(_comicId)

  let comic = await db.query('comic', { comicId })
  if (comic = comic[0] && Date.now() - comic.createTime < 1000 * 60 * 60 * 24 * 3) {
    return comic
  }

  let result = await siteList[site].getComicInfo(comicId)

  result.data.id = `${site}:${result.data.id}`
  result.data.cover = `${site}:${result.data.cover}`
  result.createTime = Date.now()

  // comic ? await db.update('comic', { comicId }, result) : await db.insert('comic', result)
  // TODO

  return result
}

async function getChapterList(_comicId) {
  const [site, comicId] = checkSite(_comicId)

  let result = await siteList[site].getChapterList(comicId)

  return result
}

async function getChapterDetail(_comicId, chapterId) {
  const [site, comicId] = checkSite(_comicId)

  let result = await siteList[site].getChapterDetail(comicId, chapterId)

  result.list = result.list.map(item => {
    item.url = `${site}:${item.url}`
    return item
  })

  return result
}

async function getImage(_url) {
  const [site, url] = checkSite(_url)

  return await siteList[site].getImage(url)
}

module.exports = {
  _siteList: siteList,
  getSiteList,
  searchComic,
  getComicInfo,
  getChapterList,
  getChapterDetail,
  getImage,
}
