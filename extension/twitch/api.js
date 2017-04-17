const querystring = require('querystring')

const twitchAPI = {
  url: 'https://api.twitch.tv/kraken',
  resources: {
    users: 'users',
    channel: 'channels/{{id}}',
    stream: 'streams/{{id}}',
  },
}

module.exports = (nodecg, twitch, token) => {
  const {
    clientID,
    timeBetweenRetries = 30000,
  } = nodecg.bundleConfig

  const {
    channelId,
    userInfo,
    userId
  } = twitch.replicants

  let userInfoRequest = Promise.resolve()
  let userInfoRequestRetryTimeout

  const createApiRequest = ({
    resource,
    params = {},
    method = 'GET',
  } = {}) => {
    const url = `${twitchAPI.url}/${twitchAPI.resources[resource]}`
      .replace('{{id}}', userId.value)

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
    userId.value = null
    userInfo.value = null
    userInfoRequestRetryTimeout = clearTimeout(userInfoRequestRetryTimeout)

    userInfoRequest = createApiRequest({
      resource: 'users',
      params: { login: newChannelId },
    })
      .then(({ users }) => {
        if (!users || users.length <= 0) {
          throw new Error(`Could not retrieve user information for ${newChannelId}`)
        }

        // eslint-disable-next-line no-underscore-dangle
        userId.value = users[0]._id
        userInfo.value = users[0]
      })
      .catch((error) => {
        userInfoRequestRetryTimeout = setTimeout(
          () => fetchUserInfoFor(newChannelId),
          timeBetweenRetries
        )

        nodecg.log.error(error)
        throw error
      })
  }

  // twitch api v5 requires that all requests use user ID, rather than
  // channel name, so whenever the channel ID is changed we need to perform
  // a lookup before any other API requests can happen
  channelId.on('change', newChannelId => fetchUserInfoFor(newChannelId))

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
