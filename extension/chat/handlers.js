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
      content: messageText,
    }

    send(message.type, {
      channel,
      message,
      user: getUserInfo(userstate)
    })
  })

  // cheers contain bits which require further parsing on the client
  // https://github.com/justintv/Twitch-API/blob/master/IRC.md#bits-message
  chat.on('cheer', (channel, userstate, message) => {
    send('cheer', {
      cheer: {
        message,
        user: getUserInfo(userstate),
        bits: userstate.bits,
      }
    })
  })

  // handle when users have been naughty
  chat.on('ban', (channel, user, reason) => {
    send('ban', { user, reason })
  })

  chat.on('timeout', (channel, user, reason, duration) => {
    send('timeout', { user, reason, duration })
  })

  chat.on('clearchat', () => send('clear'))

  // join/part messages are batched and dispatched every 30 seconds or so
  chat.on('join', (channel, username, self) => send('join', { username, self }))
  chat.on('part', (channel, username, self) => send('part', { username, self }))

  // handle chat config modes
  chat.on('subscribers', (channel, enabled) => send('subscribers', { enabled }))
  chat.on('slowmode', (channel, enabled) => send('slowmode', { enabled }))
  chat.on('emoteonly', (channel, enabled) => send('emoteonly', { enabled }))
  chat.on('r9kbeta', (channel, enabled) => send('r9kbeta', { enabled }))
}
