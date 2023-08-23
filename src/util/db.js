const { MongoClient, ServerApiVersion } = require('mongodb')
const config = require('./config')
const logger = require('./../util/log').child({ module: 'DB' })

const uri = config('db.uri')

const _client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
)

let client

async function initClient() {
  await _client.connect()

  client = _client.db(config('db.name'))
  
  setInterval(() => {
    client.command({ ping: 1 })
  }, 10000)

  // if no user exists, create a default user
  const user = await client.collection('user').findOne()
  if (!user) {
    logger.info('No user exists, creating a default user')

    const crypto = require('crypto')
    let password = crypto.createHash('sha256').update(JSON.stringify({
      password: '123456',
      secret: config('system.key', ''),
    })).digest('hex')
    
    await client.collection('user').insertOne({
      username: 'admin',
      password,
      token: require('./common').randomString(32),
    })
  }
}

module.exports = {
  getClient: () => client,
  initClient,
}
