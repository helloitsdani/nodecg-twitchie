const getUserInfo = (userstate = {}) => ({
  id: userstate['user-id'],
  username: userstate.username,
  'display-name': userstate['display-name'],
  'user-type': userstate['user-type'], // empty, mod, global-mod, admin, staff
  color: userstate.color,
  badges: userstate.badges,
  mod: userstate.mod,
  turbo: userstate.turbo,
  subscriber: userstate.subscriber,
  broadcaster: (userstate.badges && userstate.badges.broadcaster !== undefined)
})

module.exports = (nodecg, events, twitch) => {
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
  // can contain emotes which require further parsing on the client
  // https://github.com/justintv/Twitch-API/blob/master/IRC.md#bits-message
  chat.on('message', (channel, userstate, messageText) => {
    const message = {
      id: userstate.id,
      type: userstate['message-type'],
      emotes: userstate.emotes,
      message: messageText,
    }

    send({
      action: message.type,
      payload: {
        channel,
        user: getUserInfo(userstate),
        message,
      }
    })
  })

  // cheers contain bits which require further parsing on the client
  // https://github.com/justintv/Twitch-API/blob/master/IRC.md#bits-message
  chat.on('cheer', (channel, userstate, message) => {
    send({
      action: 'cheer',
      payload: {
        channel,
        user: getUserInfo(userstate),
        cheer: {
          message,
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

  chat.on('resub', (channel, username, months, message, userstate, extra = {}) => {
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
