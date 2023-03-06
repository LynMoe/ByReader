const crypto = require('crypto')
const config = require('./../util/config')

const db = require('./../db')

async function checkOrCreateUser(email, passcode) {
  passcode = crypto.createHash('sha256').update(JSON.stringify(passcode + config('system.key', ''))).digest('hex')
  let combinedId = crypto.createHash('sha256').update(JSON.stringify(`${email}:${passcode}` + config('system.key', ''))).digest('hex')

  const user = await db.query('user', { email }, {
    findOne: true,
  })
  if (!user) {
    await db.insert('user', {
      email,
      passcode,
      combinedId,
      created: (new Date()).getTime(),
    })
  } else {
    if (user.passcode !== passcode) throw new Error('Passcode not match')
  }

  return combinedId
}

async function checkCombinedId(combinedId) {
  const user = await db.query('user', { combinedId }, {
    findOne: true,
  })

  return !!user
}

async function getUserInfo(combinedId) {
  return await db.query('user', { combinedId }, {
    findOne: true,
  })
}

async function getUserBookshelf(combinedId) {
  return await db.query('bookshelf', { combinedId }, {
    findOne: true,
  }) || []
}

async function addBookToBookshelf(combinedId, comicId) {
  const bookshelf = await db.query('bookshelf', { combinedId }, {
    findOne: true,
  })
  if (!bookshelf) {
    return await db.insert('bookshelf', {
      combinedId,
      comicIds: [comicId],
      progress: {},
    })
  } else {
    const comicIds = bookshelf.comicIds
    if (!comicIds.includes(comicId)) {
      comicIds.push(comicId)
      return await db.update('bookshelf', { combinedId }, { comicIds })
    }
  }
}

async function removeBookFromBookshelf(combinedId, comicId) {
  const bookshelf = await db.query('bookshelf', { combinedId }, {
    findOne: true,
  })
  if (!bookshelf) return

  const comicIds = bookshelf.comicIds
  if (comicIds.includes(comicId)) {
    comicIds.splice(comicIds.indexOf(comicId), 1)
    return await db.update('bookshelf', { combinedId }, { comicIds })
  }
}

async function setReadingProgress(combinedId, comicId, chapterId) {
  let bookshelf = await db.query('bookshelf', { combinedId }, {
    findOne: true,
  })
  if (!bookshelf) {
    bookshelf = {
      combinedId,
      comicIds: [],
      progress: {},
    }

    await db.insert('bookshelf', bookshelf)
  }

  const progress = bookshelf.progress || {}
    progress[comicId] = chapterId
    return await db.update('bookshelf', { combinedId }, { progress })
}

module.exports = {
  checkOrCreateUser,
  checkCombinedId,
  getUserInfo,
  getUserBookshelf,
  addBookToBookshelf,
  removeBookFromBookshelf,
  setReadingProgress,
}
