const querystring = require('querystring')
const request = require('request-promise-native')

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

  return request({
    url: `${url}?${paramString}`,
    method,
    json: true,
    headers: {
      Accept: 'application/vnd.twitchtv.v5+json',
      Authorization: token,
      'Client-ID': config.clientID
    }
  })
}

const verifyCredentials = (params = {}) =>
  (params.auth && params.auth.token)
    ? Promise.resolve(params)
    : Promise.reject(new Error('No Twitch auth token provided'))

const createApiRequest = params =>
  verifyCredentials(params)
    .then(apiRequest)

module.exports = createApiRequest
