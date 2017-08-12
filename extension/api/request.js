const querystring = require('querystring')
const request = require('request')

const { log, config } = require('../context')

const twitchAPI = require('./twitch-api.json')

const apiRequest = ({
  resource,
  userId,
  params = {},
  auth: {
    token,
  } = {},
  method = 'GET',
} = {}) => {
  const url = `${twitchAPI.url}/${twitchAPI.resources[resource]}`
    .replace('{{id}}', userId)

  const paramString = querystring.stringify(params)

  log.debug(`Performing ${method} request to '${url}?${paramString}'`)

  return new Promise((resolve, reject) => {
    request(
      {
        url: `${url}?${paramString}`,
        method,
        json: true,
        headers: {
          Accept: 'application/vnd.twitchtv.v5+json',
          Authorization: token,
          'Client-ID': config.clientID
        }
      },
      (err, res, body) => err ? reject(err) : resolve(body)
    )
  })
}

const verifyCredentials = auth =>
  (auth && auth.token)
    ? Promise.resolve()
    : Promise.reject()

const createApiRequest = params => verifyCredentials(params.auth)
  .then(() => apiRequest(params))

module.exports = createApiRequest
