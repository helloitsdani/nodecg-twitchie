import TwitchClient from 'twitch'
import TwitchChatClient from 'twitch-chat-client'

import context from '../context'

import bindChatHandlers from './chat-handlers'

interface TwitchieClientAuthProps {
  username: string
  token: string
}

class TwitchieClientWrapper {
  public client?: TwitchChatClient

  public api?: TwitchClient

  public auth?: TwitchieClientAuthProps

  public isConnected = () => !!this.client

  public disconnect = async () => {
    try {
      await this.client!.quit()
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

    this.api = await TwitchClient.withCredentials(context.config.clientID, this.auth.token, undefined)
    this.client = await TwitchChatClient.forTwitchClient(this.api, {
      channels: () => {
        const currentChannel = context.replicants.channel.id.value || this.auth?.username
        return currentChannel ? [currentChannel] : []
      },
    })

    try {
      bindChatHandlers(this.client)
      await this.client.connect()
      context.replicants.channel.id.value = this.auth?.username
    } catch (error) {
      this.api = undefined
      this.client = undefined
      context.log.error('Could not connect to Twitch!', error)
      throw error
    }
  }
}

export { TwitchieClientWrapper }
export default new TwitchieClientWrapper()
