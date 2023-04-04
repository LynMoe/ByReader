const NedbDatastore = require('nedb')
const config = require('./../util/config')
let logger = require('./../util/log')

class Nedb {
  async init(collection, filename, options = {}) {
    logger = logger.child({ module: `DB NeDB: ${collection}` })
    logger.verbose('Init', collection, filename)

    this._collection = collection
    this._db = new NedbDatastore({
      filename: filename,
      autoload: true,
      beforeDeserialization: (data) => { // TODO: encrypt and decrypt
        return data
      },
      afterSerialization: (data) => {
        return data
      },
    })
    this._db.persistence.setAutocompactionInterval(config('db.nedb.autocompactionInterval', 1000 * 60 * 30))

    if (options.indexFields) {
      for (const field of options.indexFields) {
        await new Promise((resolve, reject) => {
          this._db.ensureIndex({
            fieldName: field,
            unique: true,
          }, (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
      }
    }
  }

  async insert(data) {
    logger.verbose('Insert', this._collection, data)

    return new Promise((resolve, reject) => {
      this._db.insert(data, (err, doc) => {
        if (err) reject(err)
        else resolve(doc)
      })
    })
  }

  async update(query, data, options = {}) {
    logger.verbose('Update', this._collection, query, data)

    return new Promise((resolve, reject) => {
      this._db.update(query, {
        $set: data,
      }, options, (err, numReplaced) => {
        if (err) reject(err)
        else resolve(numReplaced)
      })
    })
  }

  async query(query, options = {}) {
    logger.verbose('Query', this._collection, query, options)

    return new Promise((resolve, reject) => {
      const cb = (err, docs) => {
        if (err) {
          logger.error('Query error', err)
          reject(err)
        } else {
          logger.debug('Query result', docs)
          resolve(docs)
        }
      }

      if (options.findOne) {
        this._db.findOne(query, cb)
      } else {
        this._db.find(query, cb)
      }
    })
  }

  async remove(query, options = {}) {
    logger.verbose('Remove', this._collection, query, options)

    return new Promise((resolve, reject) => {
      this._db.remove(query, options, (err, numRemoved) => {
        if (err) reject(err)
        else resolve(numRemoved)
      })
    })
  }
}

module.exports = Nedb
