const querystring = require('querystring')

const twitchAPI = {
  url: 'https://api.twitch.tv/kraken',
  resources: {
    channel: 'channels/{{channelId}}',
    stream: 'streams/{{channelId}}',
  },
}

module.exports = (nodecg, client, token) => {
  const channelId = nodecg.Replicant('channel.id')
  const { clientID } = nodecg.bundleConfig

  const apiRequest = ({
    resource,
    params = {},
    method = 'GET',
  } = {}) => {
    const url = `${twitchAPI.url}/${twitchAPI.resources[resource]}`
      .replace('{{channelId}}', channelId.value)

    const paramString = querystring.stringify(params)

    return new Promise((resolve, reject) => {
      client.api(
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

  // proxy convenience methods for performing API requests
  // rather than having to do api('channel', ...), this lets you
  // call api.channel(...)
  return new Proxy(apiRequest, {
    get: (target, resource) => (
      resource in twitchAPI.resources
        ? ({ params, method } = {}) => (
          apiRequest({
            resource,
            params,
            method
          })
        )
        : target[resource]
    )
  })
}
