const tmi = require('tmi.js')
const context = require('../context')
const getChatChannelFor = require('../utils/getChatChannelFor')
const bindChatHandlers = require('./chat-handlers')

const { log, replicants } = context

const twitch = {
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

context.twitch = twitch

twitch.api = require('./api')

twitch.isConnected = () => !!twitch.client

twitch.disconnect = () => twitch.client.disconnect()
  .then(() => { twitch.client = undefined })
  .catch(() => { twitch.client = undefined })

twitch.connect = ({ username, token }) => {
  twitch.auth.username = username
  twitch.auth.token = token

  log.debug('Connecting to twitch...')

  const prepareClient = () => twitch.isConnected()
    ? twitch.disconnect()
    : Promise.resolve()

  // force any old connections to close and swallow errors
  prepareClient()
    .then(() => {
      const currentChannel = replicants.channel.id.value || twitch.auth.username

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
        logger: log,
      })

      bindChatHandlers(twitch.client)

      return twitch.client.connect()
        .then(() => {
          replicants.channel.id.value = currentChannel
        })
        .catch((error) => {
          twitch.client = undefined
          log.error('Could not connect to Twitch!', error)
          throw error
        })
    })
}

module.exports = twitch
