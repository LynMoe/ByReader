const axios = require('axios')
const retry = require('./retry')

async function fetch (url, options) {
  // TODO: add cdn worker callback support
  const response = await axios(url, {
    responseType: 'text',
    ...options,
  })

  return await response.data
}

module.exports = fetch
