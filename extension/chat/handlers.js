const getUserInfo = userstate => ({
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

module.exports = (nodecg, twitch) => {
  // conveinence shorthands
  const chat = twitch.client
  const send = (key, data) => nodecg.sendMessage(`chat.${key}`, data)

  chat.on('connected', () => send('connected'))
  chat.on('connecting', () => send('connecting'))
  chat.on('disconnected', reason => send('disconnected', { reason }))
  chat.on('reconnect', () => send('reconnect'))

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

    send(message.type, {
      channel,
      user: getUserInfo(userstate),
      message,
    })
  })

  // cheers contain bits which require further parsing on the client
  // https://github.com/justintv/Twitch-API/blob/master/IRC.md#bits-message
  chat.on('cheer', (channel, userstate, message) => {
    send('cheer', {
      channel,
      user: getUserInfo(userstate),
      cheer: {
        message,
        bits: userstate.bits,
      },
    })
  })

  chat.on(
    'subscription',
    (channel, username, extra = {}) => {
      send('subscription', {
        channel,
        username,
        resub: false,
        prime: !!extra.prime,
      })
    }
  )

  chat.on(
    'resub',
    (channel, username, months, message, userstate, extra = {}) => {
      send('subscription', {
        channel,
        username,
        months,
        message,
        resub: true,
        prime: !!extra.prime,
      })
    }
  )

  // handle when users have been naughty
  chat.on('ban', (channel, user, reason) => {
    send('ban', { channel, user, reason })
  })

  chat.on('timeout', (channel, user, reason, duration) => {
    send('timeout', { channel, user, reason, duration })
  })

  chat.on('clearchat', () => send('clear'))

  // join/part messages are batched and dispatched every 30 seconds or so
  chat.on('join', (channel, username, self) => send('join', { channel, username, self }))
  chat.on('part', (channel, username, self) => send('part', { channel, username, self }))

  // handle chat config modes
  chat.on('subscribers', (channel, enabled) => send('subscribers', { channel, enabled }))
  chat.on('slowmode', (channel, enabled) => send('slowmode', { channel, enabled }))
  chat.on('emoteonly', (channel, enabled) => send('emoteonly', { channel, enabled }))
  chat.on('r9kbeta', (channel, enabled) => send('r9kbeta', { channel, enabled }))

  // handle channel-related updates which twitch sends through chat
  chat.on(
    'hosted',
    (channel, host, viewers) => send('hosted', { channel, host, viewers })
  )

  chat.on(
    'hosting',
    (channel, target, viewers) => send('hosting', { channel, target, viewers })
  )

  chat.on(
    'unhost',
    (channel, viewers) => send('unhost', { channel, viewers })
  )
}
