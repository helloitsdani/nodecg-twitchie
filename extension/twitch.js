const tmi = require('tmi.js')

const twitchAPI = {
  url: 'https://api.twitch.tv/kraken',
  methods: {
    channel: 'channels',
    stream: 'streams',
  },
}

module.exports = (nodecg, { username, token }) => {
  const config = nodecg.bundleConfig

  const channelId = nodecg.Replicant('channel.id', {
    defaultValue: username,
    persistent: false
  })

  const client = tmi.client({
    options: {
      debug: true
    },
    connection: {
      cluster: 'aws',
      reconnect: true
    },
    identity: {
      username,
      password: `oauth:${token}`,
    },
    channels: [`#${channelId.value}`]
  })

  const createAPIRequest = type => () => {
    const apiURL = `${twitchAPI.url}/${twitchAPI.methods[type]}`

    return new Promise((resolve, reject) => {
      client.api(
        {
          url: `${apiURL}/${channelId.value}`,
          method: 'GET',
          headers: {
            Accept: 'application/vnd.twitchtv.v3+json',
            Authorization: token,
            'Client-ID': config.clientID
          }
        },
        (err, res, body) => err ? reject(err) : resolve(body)
      )
    })
  }

  return {
    client,
    api: {
      getChannelInfo: createAPIRequest('channel'),
      getStreamInfo: createAPIRequest('stream')
    }
  }
}
