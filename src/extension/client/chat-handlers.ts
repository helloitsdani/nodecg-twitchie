import { EmitMessageParamsBag } from '../../common/events'
import context from '../context'
import { getMessageDetails, getUserDetails, parseCheermotes, parseTokens } from '../utils/parseMessage'

const { events, replicants } = context
const {
  chat: { cheermotes },
} = replicants

const parseCheermotesFromTwitch = (message: any) => parseCheermotes(message, cheermotes.value)

const send = ({ scope = 'chat', action, payload }: EmitMessageParamsBag) =>
  events.emitMessage({ scope, action, payload })

export default (chat: any) => {
  chat.on('connected', () => {
    send({ action: 'connected' })
  })

  chat.on('connecting', () => {
    send({ action: 'connecting' })
  })

  chat.on('disconnected', (reason: string) => {
    send({ action: 'disconnected', payload: { reason } })
  })

  chat.on('reconnect', () => {
    send({ action: 'reconnect' })
  })

  // message fires on either a chat message, an action, or a whisper
  chat.on('message', (channel: any, userstate: any, messageText: any) => {
    const message = getMessageDetails(messageText, userstate)
    const user = getUserDetails(userstate)

    send({
      action: message.type,
      payload: {
        channel,
        user,
        message,
      },
    })
  })

  // cheers contain bits within the userstate and may have special emotes in
  // their message text which need to be parsed separately via a regex, rather
  // than twitchirc's usual way of handling emotes
  chat.on('cheer', (channel: any, userstate: any, messageText: any) => {
    const user = getUserDetails(userstate)
    const message = getMessageDetails(messageText, userstate)
    message.tokens = parseTokens(message.tokens, (token: any) => parseCheermotesFromTwitch(token))

    send({
      action: 'cheer',
      payload: {
        channel,
        user,
        message,
        cheer: {
          bits: userstate.bits,
        },
      },
    })
  })

  // handle when users have been naughty
  chat.on('ban', (channel: any, user: any, reason: any) => {
    send({
      action: 'ban',
      payload: { channel, user, reason },
    })
  })

  chat.on('timeout', (channel: any, user: any, reason: any, duration: any) => {
    send({
      action: 'timeout',
      payload: { channel, user, reason, duration },
    })
  })

  chat.on('clearchat', () => {
    send({ action: 'clear' })
  })

  // join/part messages are batched and dispatched every 30 seconds or so
  chat.on('join', (channel: any, username: any, self: any) => {
    send({
      action: 'join',
      payload: { channel, username, self },
    })
  })

  chat.on('part', (channel: any, username: any, self: any) => {
    send({
      action: 'part',
      payload: { channel, username, self },
    })
  })

  // handle chat config modes
  chat.on('subscribers', (channel: any, enabled: any) => {
    send({
      action: 'subscribers',
      payload: { channel, enabled },
    })
  })

  chat.on('slowmode', (channel: any, enabled: any) => {
    send({
      action: 'slowmode',
      payload: { channel, enabled },
    })
  })

  chat.on('emoteonly', (channel: any, enabled: any) => {
    send({
      action: 'emoteonly',
      payload: { channel, enabled },
    })
  })

  chat.on('r9kbeta', (channel: any, enabled: any) => {
    send({
      action: 'r9kbeta',
      payload: { channel, enabled },
    })
  })

  // handle channel-related updates which twitch sends through chat
  chat.on('subscription', (channel: any, username: any, extra: any = {}) => {
    send({
      scope: 'channel',
      action: 'subscription',
      payload: {
        channel,
        username,
        resub: false,
        prime: !!extra.prime,
      },
    })
  })

  chat.on('resub', (channel: any, username: any, months: any, messageText: any, _: any, extra: any = {}) => {
    const message = getMessageDetails(messageText)

    send({
      scope: 'channel',
      action: 'subscription',
      payload: {
        channel,
        username,
        months,
        message,
        resub: true,
        prime: !!extra.prime,
      },
    })
  })

  chat.on('hosted', (channel: any, host: any, viewers: any) => {
    send({
      scope: 'channel',
      action: 'hosted',
      payload: { channel, host, viewers },
    })
  })

  chat.on('hosting', (channel: any, target: any, viewers: any) => {
    send({
      scope: 'channel',
      action: 'hosting',
      payload: { channel, target, viewers },
    })
  })

  chat.on('unhost', (channel: any, viewers: any) => {
    send({
      scope: 'channel',
      action: 'unhost',
      payload: { channel, viewers },
    })
  })
}
