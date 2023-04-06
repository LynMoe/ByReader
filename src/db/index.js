const config = require('./../util/config')
const path = require('path')
const logger = require('./../util/log').child({ module: 'DB' })

const nedb = require('./nedb')

const dbList = {
  nedb,
}

const dbType = config('db.type')
if (!dbList[dbType]) throw new Error(`DB type ${dbType} not found`)
const dbPath = path.resolve(__dirname, '../../', config('db.path'))

const collectionList = {
  user: {
    db: null,
    indexFields: ['combinedId'],
  },
  bookshelf: {
    db: null,
    indexFields: ['combinedId'],
  },
}

function checkCollection(collection) {
  if (!collectionList[collection]) throw new Error(`Collection ${collection} not found`)
  return collectionList[collection].db
}

async function init() {
  for (const collection of Object.keys(collectionList)) {
    const db = new dbList[dbType]()
    logger.debug('Init', collection)
    await db.init(collection, path.resolve(dbPath, `${collection}.${dbType}.db`), {
      indexFields: collectionList[collection].indexFields,
    })
    collectionList[collection].db = db
  }
}

async function optimize() {
  for (const db in collectionList) {
    db && db.optimize && await db.optimize()
  }
}

async function query(collection, query, options = {}) {
  const db = checkCollection(collection)

  return await db.query(query, options)
}

async function insert(collection, data) {
  const db = checkCollection(collection)

  return await db.insert(data)
}

async function update(collection, query, data) {
  const db = checkCollection(collection)

  return await db.update(query, data)
}

async function remove(collection, query) {
  const db = checkCollection(collection)

  return await db.remove(query)
}

module.exports = {
  init,
  optimize,
  query,
  insert,
  update,
  remove,
}
