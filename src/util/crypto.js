const aesjs = require('aes-js')
const config = require('./config')

module.exports = {
  decrypt(string, key, iv) {
    const keyBytes = aesjs.utils.utf8.toBytes(key)
    const ivBytes = aesjs.utils.utf8.toBytes(iv)

    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes)

    let decryptedBytes = aesCbc.decrypt(aesjs.utils.hex.toBytes(string))
    decryptedBytes = aesjs.padding.pkcs7.strip(decryptedBytes)

    return aesjs.utils.utf8.fromBytes(decryptedBytes)
  },

  sha256(str) {
    return crypto.createHash('sha256').update(JSON.stringify(str + config('system.key', ''))).digest('hex')
  },
}
