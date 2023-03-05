function retry (fn, times = 3, interval = 300) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      return Promise.resolve().then(fn).then(resolve).catch(err => {
        if (times === 1) {
          reject(err)
        } else {
          times--
          setTimeout(attempt, interval)
        }
      })
    }
    
    return attempt()
  })
}

module.exports = retry
