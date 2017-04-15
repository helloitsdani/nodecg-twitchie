const tmi = require('tmi.js')
const twitchAPI = require('./api')

module.exports = (nodecg, { username, token }) => {
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

  const api = twitchAPI(nodecg, client, token)

  return {
    client,
    api,
  }
}
