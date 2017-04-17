const tmi = require('tmi.js')
const twitchAPI = require('./api')
const createReplicants = require('./replicants')

module.exports = (nodecg, { username, token }) => {
  const replicants = createReplicants(nodecg, { channelId: username })

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
    channels: [`#${replicants.channelId.value}`],
    logger: nodecg.log,
  })

  const api = twitchAPI(nodecg, { client, replicants }, token)

  const disconnect = () => {
    replicants.cleanup()
    return client.disconnect()
  }

  const connect = () => client.connect()

  return {
    client,
    api,
    connect,
    disconnect,
    replicants,
  }
}
