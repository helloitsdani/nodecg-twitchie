import { getMessageDetails, getUserDetails, parseCheermotes, parseTokens } from '../utils/parseMessage'

import context from '../context'

const parseCheermotesFromTwitch = (message: any) => parseCheermotes(message, context.replicants.chat.cheermotes.value)

export default (chat: any) => {
  chat.on('connected', () => {
    context.events.emitMessage('chat.connected', undefined)
  })

  chat.on('connecting', () => {
    context.events.emitMessage('chat.connecting', undefined)
  })

  chat.on('disconnected', (reason: string) => {
    context.events.emitMessage('chat.disconnected', reason)
  })

  chat.on('reconnect', () => {
    context.events.emitMessage('chat.reconnect', undefined)
  })

  // message fires on either a chat message, an action, or a whisper
  chat.on('message', (channel: any, userstate: any, messageText: any) => {
    const message = getMessageDetails(messageText, userstate)
    const user = getUserDetails(userstate)

    if (message.type === 'whisper') {
      // shhhhhhhhh....secrets
      return
    }

    const actionType = message.type === 'action' ? 'chat.action' : 'chat.chat'

    const payload = {
      channel,
      user,
      message,
    }

    context.events.emitMessage(actionType, payload)
  })

  // cheers contain bits within the userstate and may have special emotes in
  // their message text which need to be parsed separately via a regex, rather
  // than twitchirc's usual way of handling emotes
  chat.on('cheer', (channel: any, userstate: any, messageText: any) => {
    const user = getUserDetails(userstate)
    const message = getMessageDetails(messageText, userstate)
    message.tokens = parseTokens(message.tokens, (token: any) => parseCheermotesFromTwitch(token))

    const payload = {
      channel,
      user,
      message,
      cheer: {
        bits: userstate.bits,
      },
    }

    context.events.emitMessage('chat.cheer', payload)
  })

  // handle when users have been naughty
  chat.on('ban', (channel: any, user: any, reason: any) => {
    const payload = { channel, user, reason }
    context.events.emitMessage('chat.ban', payload)
  })

  chat.on('timeout', (channel: any, user: any, reason: any, duration: any) => {
    const payload = { channel, user, reason, duration }
    context.events.emitMessage('chat.timeout', payload)
  })

  chat.on('clearchat', () => {
    context.events.emitMessage('chat.clear', undefined)
  })

  // join/part messages are batched and dispatched every 30 seconds or so
  chat.on('join', (channel: any, username: any, self: any) => {
    const payload = { channel, username, self }
    context.events.emitMessage('chat.join', payload)
  })

  chat.on('part', (channel: any, username: any, self: any) => {
    const payload = { channel, username, self }
    context.events.emitMessage('chat.part', payload)
  })

  // handle channel-related updates which twitch sends through chat
  chat.on('subscription', (channel: any, username: any, extra: any = {}) => {
    const payload = {
      channel,
      username,
      resub: false,
      prime: !!extra.prime,
    }

    context.events.emitMessage('channel.subscription', payload)
  })

  chat.on('resub', (channel: any, username: any, months: any, messageText: any, _: any, extra: any = {}) => {
    const message = getMessageDetails(messageText)

    const payload = {
      channel,
      username,
      months,
      message,
      resub: true,
      prime: !!extra.prime,
    }

    context.events.emitMessage('channel.subscription', payload)
  })

  chat.on('hosted', (channel: any, host: any, viewers: any) => {
    const payload = { channel, host, viewers }
    context.events.emitMessage('channel.hosted', payload)
  })

  chat.on('hosting', (channel: any, target: any, viewers: any) => {
    const payload = { channel, target, viewers }
    context.events.emitMessage('channel.hosting', payload)
  })

  chat.on('unhost', (channel: any, viewers: any) => {
    const payload = { channel, viewers }
    context.events.emitMessage('channel.unhost', payload)
  })
}
