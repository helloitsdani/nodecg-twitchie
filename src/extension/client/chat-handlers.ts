import { ChatClient, ChatUser } from '@twurple/chat'
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage'

import { ChatMessage, ChatMessageType } from '../../types'
import context from '../context'

const serializeUser = (user: ChatUser) => ({
  id: user.userId,
  name: user.displayName ?? user.userName,
  username: user.userName,
  color: user.color,
  badges: Object.fromEntries(user.badges.entries()),
  isBroadcaster: user.isBroadcaster,
  isFounder: user.isFounder,
  isMod: user.isMod,
  isSubscriber: user.isSubscriber,
  isVip: user.isVip,
})

const serializeMessage = (type: ChatMessageType, rawMessage: string, message: TwitchPrivateMessage): ChatMessage => ({
  id: message.id,
  type,
  user: serializeUser(message.userInfo),
  message: rawMessage,
  tokens: message.parseEmotesAndBits(context.replicants.chat.cheermotes.value, {
    background: 'dark',
    scale: '4',
    state: 'animated',
  }),
  isCheer: message.isCheer,
  bits: message.bits,
})

export default (client: ChatClient) => {
  client.onAction((channel, _, raw, message) => {
    context.events.emitMessage('chat.action', {
      channel,
      message: serializeMessage(ChatMessageType.action, raw, message),
    })
  })

  client.onMessage((channel, _, raw, message) => {
    context.events.emitMessage('chat.message', {
      channel,
      message: serializeMessage(ChatMessageType.message, raw, message),
    })
  })

  /* rituals */
  client.onRitual((channel, user, ritualInfo) => {
    if (ritualInfo.ritualName === 'new_chatter') {
      context.events.emitMessage('ritual.new', {
        name: user,
        message: ritualInfo.message,
      })
    } else {
      context.events.emitMessage('ritual', {
        channel,
        user,
        message: ritualInfo.message,
        ritualName: ritualInfo.ritualName,
      })
    }
  })

  /* naughty management options */
  client.onChatClear(() => {
    context.events.emitMessage('chat.clear', undefined)
  })

  client.onMessageRemove((channel, messageId) => {
    context.events.emitMessage('chat.removeMessage', { channel, messageId })
  })

  client.onTimeout((channel, user, duration) => {
    context.events.emitMessage('chat.timeout', { channel, user, duration })
  })

  client.onBan((channel, user) => {
    context.events.emitMessage('chat.ban', { channel, user })
  })
}
