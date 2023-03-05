class SiteError extends Error {
  constructor(message) {
    super(message)
  }
}

class InternalError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = {
  SiteError,
  InternalError,
}