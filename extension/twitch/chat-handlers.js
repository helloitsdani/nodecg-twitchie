const {
  getMessageDetails,
  getUserDetails,
  parseCheermotes,
  parseTokens,
} = require('../utils/parseMessage')

module.exports = (nodecg, events, twitch) => {
  const {
    chat: { cheermotes }
  } = twitch.replicants

  // conveinence shorthands
  const chat = twitch.client
  const send = ({ scope = 'chat', action, payload } = {}) =>
    events.emitMessage({ scope, action, payload })

  chat.on('connected', () => {
    send({ action: 'connected' })
  })

  chat.on('connecting', () => {
    send({ action: 'connecting' })
  })

  chat.on('disconnected', (reason) => {
    send({ action: 'disconnected', payload: { reason } })
  })

  chat.on('reconnect', () => {
    send({ action: 'reconnect' })
  })

  // message fires on either a chat message, an action, or a whisper
  chat.on('message', (channel, userstate, messageText) => {
    const message = getMessageDetails(messageText, userstate)
    const user = getUserDetails(userstate)

    send({
      action: message.type,
      payload: {
        channel,
        user,
        message,
      }
    })
  })

  // cheers contain bits within the userstate and may have special emotes in
  // their message text which need to be parsed separately via a regex, rather
  // than twitchirc's usual way of handling emotes
  chat.on('cheer', (channel, userstate, messageText) => {
    const user = getUserDetails(userstate)
    const message = getMessageDetails(messageText, userstate)
    message.tokens = parseTokens(
      message.tokens,
      token => parseCheermotes(token, cheermotes.value)
    )

    send({
      action: 'cheer',
      payload: {
        channel,
        user,
        message,
        cheer: {
          bits: userstate.bits,
        },
      }
    })
  })

  // handle when users have been naughty
  chat.on('ban', (channel, user, reason) => {
    send({
      action: 'ban',
      payload: { channel, user, reason },
    })
  })

  chat.on('timeout', (channel, user, reason, duration) => {
    send({
      action: 'timeout',
      payload: { channel, user, reason, duration },
    })
  })

  chat.on('clearchat', () => {
    send({ action: 'clear' })
  })

  // join/part messages are batched and dispatched every 30 seconds or so
  chat.on('join', (channel, username, self) => {
    send({
      action: 'join',
      payload: { channel, username, self },
    })
  })

  chat.on('part', (channel, username, self) => {
    send({
      action: 'part',
      payload: { channel, username, self },
    })
  })

  // handle chat config modes
  chat.on('subscribers', (channel, enabled) => {
    send({
      action: 'subscribers',
      payload: { channel, enabled },
    })
  })

  chat.on('slowmode', (channel, enabled) => {
    send({
      action: 'slowmode',
      payload: { channel, enabled },
    })
  })

  chat.on('emoteonly', (channel, enabled) => {
    send({
      action: 'emoteonly',
      payload: { channel, enabled },
    })
  })

  chat.on('r9kbeta', (channel, enabled) => {
    send({
      action: 'r9kbeta',
      payload: { channel, enabled },
    })
  })

  // handle channel-related updates which twitch sends through chat
  chat.on('subscription', (channel, username, extra = {}) => {
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

  chat.on('resub', (channel, username, months, messageText, userstate, extra = {}) => {
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

  chat.on('hosted', (channel, host, viewers) => {
    send({
      scope: 'channel',
      action: 'hosted',
      payload: { channel, host, viewers },
    })
  })

  chat.on('hosting', (channel, target, viewers) => {
    send({
      scope: 'channel',
      action: 'hosting',
      payload: { channel, target, viewers },
    })
  })

  chat.on('unhost', (channel, viewers) => {
    send({
      scope: 'channel',
      action: 'unhost',
      payload: { channel, viewers },
    })
  })
}
