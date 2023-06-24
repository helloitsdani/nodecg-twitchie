import { ApiClient } from '@twurple/api'
import { StaticAuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'

import context from '../context'

import bindChatHandlers from './chat-handlers'

interface TwitchieClientAuthProps {
  username: string
  token: string
}

class TwitchieClientWrapper {
  public api?: ApiClient

  public client?: ChatClient

  public isConnected = () => this.client && (this.client?.irc.isConnecting || this.client?.irc.isConnected)

  public disconnect = async () => {
    if (!this.client) {
      return Promise.resolve()
    }

    try {
      await this.client.quit()
    } catch (e) {
      context.log.error('Could not tear down twitch chat client!', e)
    }

    this.client = undefined
  }

  public connect = async (auth: TwitchieClientAuthProps) => {
    context.log.debug('Connecting to twitch...')

    if (this.isConnected()) {
      await this.disconnect()
    }

    const authProvider = new StaticAuthProvider(context.config.clientID, auth.token)

    this.api = new ApiClient({ authProvider })
    this.client = new ChatClient({
      authProvider,
      webSocket: true,
    })

    try {
      bindChatHandlers(this.client)
      await this.client.connect()
      context.replicants.channel.id.value = auth.username
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
