async function retry(fn, times = 3, interval = 300) {
  while (times > 0) {
    try {
      const result = await fn()
      return result
    } catch (err) {
      console.error(err)
      if (times === 1) throw err
      times--
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }
}

module.exports = retry
