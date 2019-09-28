const TwitchClient = require('twitch').default
const tmi = require('tmi.js')
const context = require('../context')
const getChatChannelFor = require('../utils/getChatChannelFor')
const bindChatHandlers = require('./chat-handlers')

const { log, replicants, config } = context

const twitch = {
  api: undefined,
  client: undefined,
  auth: {
    username: undefined,
    token: undefined,
  },
  isConnected: undefined,
  connect: undefined,
  disconnect: undefined,
}

twitch.isConnected = () => !!twitch.client

twitch.disconnect = async () => {
  try {
    await twitch.client.disconnect()
  } catch (e) {
    // Oh Well
  }

  twitch.client = undefined
}

twitch.connect = async ({ username, token }) => {
  twitch.auth.username = username
  twitch.auth.token = token

  log.debug('Connecting to twitch...')

  if (twitch.isConnected()) {
    await twitch.disconnect()
  }

  const currentChannel = replicants.channel.id.value || twitch.auth.username

  twitch.api = await TwitchClient.withCredentials(config.clientID, token, undefined)
  twitch.client = new tmi.client({
    options: {
      debug: true,
    },
    connection: {
      reconnect: true,
    },
    identity: {
      username: twitch.auth.username,
      password: `oauth:${twitch.auth.token}`,
    },
    channels: [getChatChannelFor(currentChannel)],
    logger: log,
  })

  bindChatHandlers(twitch.client)

  try {
    await twitch.client.connect()
    replicants.channel.id.value = currentChannel
  } catch (error) {
    twitch.client = undefined
    log.error('Could not connect to Twitch!', error)
    throw error
  }
}

module.exports = twitch
