const fetch = require('./../util/fetch')
const cache = require('./../cache')
const retry = require('./../util/retry')
const crypto = require('./../util/crypto')
const error = require('./../util/error')
const logger = require('./../util/log').child({ module: 'Site CopyManga' })
const parse = require('node-html-parser').parse

const site = {
  name: 'CopyManga',
  url: 'https://copymanga.site/',
  icon: 'https://copymanga.site/favicon.ico',
}

function randomString(length) {
  const chars = '0123456789'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]

  return result
}

function header() {
  return {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'cookie': `webp=0; _ga=GA1.2.${randomString(10)}.${randomString(10)}; _gid=GA1.2.${randomString(10)}.${randomString(10)}`,
    'referer': 'https://copymanga.site/',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  }
}

async function searchComic(keyword = '', page = 1) {
  const limit = 25
  const url = `${site.url}api/kb/web/searchs/comics?offset=${(page - 1) * 25}&platform=2&limit=${limit}&q=${encodeURIComponent(keyword)}&q_type=`
  const options = {
    method: 'GET',
    headers: {
      ...header(),
    accept: 'application/json, text/plain, */*',
  },
  }

  const res = await retry(async () => {
    const response = await fetch(url, options)
    let data = JSON.parse(response)

    if (data.code !== 200) throw new error.SiteError(`Search failed: ${data.message}`)

    /* example data
{
  "code": 200,
  "message": "请求成功",
  "results": {
    "list": [
      {
        "name": "姐婚",
        "alias": "恋上妖狐大嫂,姐婚,姐婚",
        "path_word": "jiehungtg",
        "cover": "https://hi77-overseas.mangafuna.xyz/jiehungtg/cover/1651022420.jpg.328x422.jpg",
        "author": [
          {
            "name": "高田桂",
            "alias": "高田桂",
            "path_word": "gaotiangui"
          }
        ],
        "popular": 17163,
        "theme": [],
        "parodies": [],
        "females": [],
        "males": []
      },
      ...,
      {
        "name": "英特爾學姐",
        "alias": "因特尔前辈,英特爾學姐,英特尔学姐",
        "path_word": "etexj",
        "cover": "https://hi77-overseas.mangafuna.xyz/etexj/cover/1651082066.jpg.328x422.jpg",
        "author": [
          {
            "name": "ゆーじ",
            "alias": "ゆーじ",
            "path_word": "youji"
          }
        ],
        "popular": 1541,
        "theme": [],
        "parodies": [],
        "females": [],
        "males": []
      }
    ],
    "total": 257,
    "limit": 12,
    "offset": 0
  }
}
    */
    return data.results
  })

  const result = {
    list: [],
    endPage: false,
  }

  if (res.offset + res.list.length >= res.total) result.endPage = true

  for (const item of res.list) {
    result.list.push({
      id: item.path_word,
      name: item.name,
      alias: [...`${item.alias || ''}`.split(',')],
      author: [
        ...item.author.map((author) => {
          return {
            id: author.path_word,
            name: author.name,
            alias: [...`${author.alias || ''}`.split(',')],
          }
        }),
      ],
      cover: `${item.cover}`.replace('.328x422.jpg', ''),
      tag: [...item.females, ...item.males], // To be confirmed
      description: '', // TODO
    })
  }

  return result
}

async function getComicInfo(comicId) {
  const url = `${site.url}comic/${comicId}`
  const options = {
    method: 'GET',
    headers: header(),
  }

  const res = await retry(async () => {
    const response = await fetch(url, options)
    const html = parse(response)

    const result = {
      id: comicId,
      name: html.querySelector('h6').textContent,
      author: [], // TODO: get author(no unique class in html)
      alias: [], // TODO
      cover: html.querySelector('.comicParticulars-left-img img').attributes['data-src'].replace('.328x422.jpg', ''),
      tag: [...html.querySelectorAll('.comicParticulars-right-tag a')].map((item) => item.textContent.replace('#', '')),
      description: html.querySelector('.intro').textContent.trim(),
    }

    return result
  })

  const result = {
    data: res,
  }

  return result
}

async function getChapterList(comicId) {
  const url = `${site.url}comicdetail/${comicId}/chapters`
  const options = {
    method: 'GET',
    headers: {
      ...header(),
      accept: '*/*',
      referer: `${site.url}comic/${comicId}`,
    },

  }

  const res = await retry(async () => {
    const response = await fetch(url, options)
    let data = JSON.parse(response)

    if (data.code !== 200) throw new error.SiteError(`Get chapter list failed: ${data.message}`)

    // key xxxmanga.woo.key
    // iv the first 16 bytes of result 
    data = crypto.decrypt(data.results.slice(16), 'xxxmanga.woo.key', data.results.slice(0, 16))
    data = JSON.parse(JSON.parse(JSON.stringify(data)))

    if (!data.groups) throw new error.SiteError(`Get chapter list failed: groups not found`)

    return data
  })

  const result = {
    bundle: [...res.build.type],
    list: [],
    lastestId: Object.values(res.groups)[0].last_chapter.uuid,
  }

  for (const item of Object.values(res.groups)[0].chapters) {
    result.list.push({
      id: item.id,
      name: item.name,
      type: item.type,
    })
  }

  return result
}

async function getChapterDetail(comicId, chapterId) {
  const url = `${site.url}comic/${comicId}/chapter/${chapterId}`
  const options = {
    method: 'GET',
    headers: header(),
  }

  const res = await retry(async () => {
    const response = await fetch(url, options)
    let data = parse(response).querySelector('.imageData').attributes['contentKey']

    // key xxxmanga.woo.key
    // iv the first 16 bytes of result 
    data = crypto.decrypt(data.slice(16), 'xxxmanga.woo.key', data.slice(0, 16))
    data = JSON.parse(data)

    if (!data.length) throw new error.SiteError(`Get chapter images failed: ${data.msg}`)

    return data
  })

  const result = {
    list: [],
  }

  for (const item of res) {
    result.list.push({
      url: `${item.url}`.replace('.webp', '.jpg').replace('c800x', 'c1200x'),
    })
  }

  return result
}

async function getImage(url) {
  const options = {
    method: 'GET',
    headers: header(),
    responseType: 'arraybuffer',
  }

  const res = retry(async () => {
    const response = await fetch(url, options)
    return response
  })

  return res
}

module.exports = {
  ...site,
  searchComic,
  getComicInfo,
  getChapterList,
  getChapterDetail,
  getImage,
}
