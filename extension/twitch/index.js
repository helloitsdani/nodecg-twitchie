const tmi = require('tmi.js')
const getChatChannelFor = require('../utils/getChatChannelFor')

const twitchAPI = require('./api')
const createReplicants = require('./replicants')
const createChatHandlers = require('./chat-handlers')

module.exports = (nodecg, events) => {
  const twitch = {
    replicants: undefined,
    client: undefined,
    auth: {
      username: undefined,
      token: undefined,
    },
    api: undefined,
    isConnected: undefined,
    connect: undefined,
    disconnect: undefined,
  }

  twitch.replicants = createReplicants(
    nodecg,
    events
  )

  twitch.api = twitchAPI(nodecg, events, twitch)

  twitch.isConnected = () => !!twitch.client

  twitch.disconnect = () => twitch.client.disconnect()
    .then(() => { twitch.client = undefined })
    .catch(() => { twitch.client = undefined })

  twitch.connect = ({ username, token }) => {
    twitch.auth.username = username
    twitch.auth.token = token

    nodecg.log.debug('Connecting to twitch...')

    const prepareClient = () => twitch.isConnected()
      ? twitch.disconnect()
      : Promise.resolve()

    // force any old connections to close and swallow errors
    prepareClient()
      .then(() => {
        const currentChannel = twitch.replicants.channel.id.value || twitch.auth.username

        twitch.client = new tmi.client({
          options: {
            debug: true
          },
          connection: {
            reconnect: true
          },
          identity: {
            username: twitch.auth.username,
            password: `oauth:${twitch.auth.token}`,
          },
          channels: [getChatChannelFor(currentChannel)],
          logger: nodecg.log,
        })

        createChatHandlers(nodecg, events, twitch)

        return twitch.client.connect()
          .then(() => {
            twitch.replicants.channel.id.value = currentChannel
          })
          .catch((error) => {
            twitch.client = undefined
            nodecg.log.error('Could not connect to Twitch!', error)
            throw error
          })
      })
  }

  return twitch
}
