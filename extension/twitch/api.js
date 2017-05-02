const querystring = require('querystring')
const debounce = require('debounce')

const twitchAPI = {
  url: 'https://api.twitch.tv/kraken',
  resources: {
    users: 'users',
    channel: 'channels/{{id}}',
    editors: 'channels/{{id}}/editors',
    followers: 'channels/{{id}}/follows',
    stream: 'streams/{{id}}',
  },
}

module.exports = (nodecg, events, twitch, token) => {
  const {
    clientID,
    timeBetweenRetries = 30000,
  } = nodecg.bundleConfig

  const {
    channel,
    user,
  } = twitch.replicants

  let userInfoRequest = Promise.resolve()
  let userInfoRequestRetryTimeout

  const createApiRequest = ({
    resource,
    params = {},
    method = 'GET',
  } = {}) => {
    const url = `${twitchAPI.url}/${twitchAPI.resources[resource]}`
      .replace('{{id}}', user.id.value)

    const paramString = querystring.stringify(params)

    nodecg.log.debug(`Performing ${method} request to '${url}?${paramString}'`)

    return new Promise((resolve, reject) => {
      twitch.client.api(
        {
          url: `${url}?${paramString}`,
          method,
          headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            Authorization: token,
            'Client-ID': clientID
          }
        },
        (err, res, body) => err ? reject(err) : resolve(body)
      )
    })
  }

  // creating API requests through this method allows you to ensure that
  // the current channel name has been resolved to a twitch userId
  const createIdentifiedApiRequest = params => (
    userInfoRequest
      .then(() => createApiRequest(params))
  )

  const fetchUserInfoFor = (newChannelId) => {
    userInfoRequest = createApiRequest({
      resource: 'users',
      params: { login: newChannelId },
    })
      .then(({ users }) => {
        if (!users || users.length <= 0) {
          user.id.value = undefined
          user.info.value = { unknown: true }

          nodecg.log.debug(`Twitch API found no users with the channel ID "${newChannelId}"`)
          return
        }

        // eslint-disable-next-line no-underscore-dangle
        user.id.value = users[0]._id
        user.info.value = users[0]
      })
      .catch((error) => {
        userInfoRequestRetryTimeout = setTimeout(
          () => fetchUserInfoFor(newChannelId),
          timeBetweenRetries
        )

        nodecg.log.error('User lookup request failed!', error)
        throw error
      })
  }

  const debouncedFetchUserInfoFor = debounce(fetchUserInfoFor, 1000)

  // twitch api v5 requires that all requests use user ID, rather than
  // channel name, so whenever the channel ID is changed we need to perform
  // a lookup before any other API requests can happen
  channel.id.on('change', (newChannelId) => {
    user.id.value = undefined
    user.info.value = undefined
    userInfoRequestRetryTimeout = clearTimeout(userInfoRequestRetryTimeout)

    debouncedFetchUserInfoFor(newChannelId)
  })

  // proxy convenience methods for performing API requests
  // rather than having to do api('channel', ...), this lets you
  // call api.channel(...)
  return new Proxy(createIdentifiedApiRequest, {
    get: (target, resource) => (
      resource in twitchAPI.resources
        ? ({ params, method } = {}) => (
          createIdentifiedApiRequest({
            resource,
            params,
            method
          })
        )
        : target[resource]
    )
  })
}
