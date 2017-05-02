const tmi = require('tmi.js')
const twitchAPI = require('./api')
const createReplicants = require('./replicants')

module.exports = (nodecg, events, { username, token }) => {
  const replicants = createReplicants(
    nodecg,
    events,
    { 'channel.id': username }
  )

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
    channels: [`#${replicants.channel.id.value}`],
    logger: nodecg.log,
  })

  const api = twitchAPI(nodecg, events, { client, replicants }, token)

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
