const querystring = require('querystring')
const request = require('request')

const { log, twitch, config } = require('../../context')
const twitchAPI = require('./twitch-api')

const { clientID } = config

const verifyCredentials = () =>
  (twitch.auth && twitch.auth.token)
    ? Promise.resolve()
    : Promise.reject()

const apiRequest = ({
  resource,
  userId,
  params = {},
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
          Authorization: twitch.auth.token,
          'Client-ID': clientID
        }
      },
      (err, res, body) => err ? reject(err) : resolve(body)
    )
  })
}

const createApiRequest = params => verifyCredentials()
  .then(() => apiRequest(params))

module.exports = createApiRequest
