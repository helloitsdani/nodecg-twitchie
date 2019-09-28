import tmi from 'tmi.js'
import TwitchClient from 'twitch'

import context from '../context'

import getChatChannelFor from '../utils/getChatChannelFor'
import bindChatHandlers from './chat-handlers'

interface TwitchieClientAuthProps {
  username: string
  token: string
}

class TwitchieClientWrapper {
  public client?: any
  public api?: TwitchClient

  public auth?: TwitchieClientAuthProps

  public isConnected = () => !!this.client

  public disconnect = async () => {
    try {
      await this.client.disconnect()
    } catch (e) {
      // Oh Well
    }

    this.client = undefined
  }

  public connect = async (auth: TwitchieClientAuthProps) => {
    this.auth = auth

    context.log.debug('Connecting to twitch...')

    if (this.isConnected()) {
      await this.disconnect()
    }

    const currentChannel = context.replicants.channel.id.value || this.auth.username

    this.api = await TwitchClient.withCredentials(context.config.clientID, this.auth.token, undefined)
    this.client = new tmi.client({
      options: {
        debug: true,
      },
      connection: {
        reconnect: true,
      },
      identity: {
        username: this.auth.username,
        password: `oauth:${this.auth.token}`,
      },
      channels: [getChatChannelFor(currentChannel)],
      logger: context.log,
    })

    bindChatHandlers(this.client)

    try {
      await this.client.connect()
      context.replicants.channel.id.value = currentChannel
    } catch (error) {
      this.client = undefined
      context.log.error('Could not connect to Twitch!', error)
      throw error
    }
  }
}

export { TwitchieClientWrapper }
export default new TwitchieClientWrapper()
