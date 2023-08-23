const axios = require('axios')
const retry = require('./retry')

function fetch (url, options) {
  // TODO: add cdn worker callback support
  const response = axios(url, {
    responseType: 'text',
    // timeout: 7000,
    ...options,
  })

  return response.then(res => res.data)
}

module.exports = fetch
