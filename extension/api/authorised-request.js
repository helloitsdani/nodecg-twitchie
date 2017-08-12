const createApiRequest = require('./request')
const context = require('../context')

const createAuthorisedApiRequest = params =>
  createApiRequest(
    Object.assign({}, params, { auth: context.twitch.auth })
  )

module.exports = createAuthorisedApiRequest
