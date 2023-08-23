const crypto = require('crypto')
const config = require('./../util/config')
const _db = require('./../util/db').getClient()
const randomString = require('./../util/common').randomString

async function createUser(username, password) {
  password = crypto.createHash('sha256').update(JSON.stringify({
    password,
    secret: config('system.key', ''),
  })).digest('hex')

  const db = _db.collection('user')
  const user = await db.findOne({ username })
  if (user) throw new Error('Username already exists')

  const token = randomString(32)

  await db.insert('user', {
    username,
    password,
    token,
    created: (new Date()).getTime(),
  })

  return token
}

async function checkUsernameAndPassword(username, password) {
  password = crypto.createHash('sha256').update(JSON.stringify({
    password,
    secret: config('system.key', ''),
  })).digest('hex')

  const db = _db.collection('user')
  const user = await db.findOne({ username })
  if (!user || user.password !== password) throw new Error('Username or password incorrect')

  return user.token
}

async function checkToken(token) {
  const db = _db.collection('user')
  const user = await db.findOne({ token })

  if (user) return user.username
  else return false
}

async function getUserInfo(username) {
  const db = _db.collection('user')
  return await db.findOne({ username })
}

async function getUserBookshelf(username) {
  const db = _db.collection('bookshelf')

  const data = await db.findOne({ username })
  if (data && Object.values(data.comicIds).length === 0) data.comicIds = {
    'Default': [],
  }
  return data || {
    comicIds: {
      'Default': [],
    },
    progress: {},
  }
}

async function addBookToBookshelf(username, bookshelfName, comicId) {
  const db = _db.collection('bookshelf')
  const bookshelf = await db.findOne({ username })
  if (!bookshelf) {
    const comicIds = {}
    comicIds[bookshelfName] = [comicId]

    return await db.insertOne({
      username,
      comicIds,
      progress: {},
    })
  } else {
    if (!bookshelf.comicIds[bookshelfName]) bookshelf.comicIds[bookshelfName] = []
    const comicIds = bookshelf.comicIds[bookshelfName]
    if (!comicIds.includes(comicId)) {
      comicIds.push(comicId)
      return await db.updateOne({ username }, { $set: { comicIds: bookshelf.comicIds } })
    }
  }
}

async function removeBookFromBookshelf(username, bookshelfName, comicId) {
  const db = _db.collection('bookshelf')
  const bookshelf = await db.findOne({ username })
  if (!bookshelf || !bookshelf.comicIds[bookshelfName]) return

  const comicIds = bookshelf.comicIds[bookshelfName]
  if (comicIds.includes(comicId)) {
    comicIds.splice(comicIds.indexOf(comicId), 1)
    if (comicIds.length === 0) {
      delete bookshelf.comicIds[bookshelfName]
    }
    return await db.updateOne({ username }, { $set: { comicIds: bookshelf.comicIds } })
  }
}

async function setReadingProgress(username, comicId, chapterId) {
  const db = _db.collection('bookshelf')
  let bookshelf = await db.findOne({ username })
  if (!bookshelf) {
    bookshelf = {
      username,
      comicIds: {},
      progress: {},
    }

    await db.insertOne(bookshelf)
  }

  const progress = bookshelf.progress || {}
  if (!progress[comicId]) progress[comicId] = []
  if (!progress[comicId].includes(chapterId)) {
    progress[comicId].push(chapterId)
  }

  return await db.updateOne({ username }, { $set: { progress } })
}

async function getReadingProgress(username, comicId) {
  const db = _db.collection('bookshelf')
  const bookshelf = await db.findOne({ username })
  if (!bookshelf) return []

  const progress = bookshelf.progress || {}
  return progress[comicId] || []
}

module.exports = {
  createUser,
  checkUsernameAndPassword,
  checkToken,
  getUserInfo,
  getUserBookshelf,
  addBookToBookshelf,
  removeBookFromBookshelf,
  setReadingProgress,
  getReadingProgress,
}
