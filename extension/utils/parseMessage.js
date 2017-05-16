const {
  getEmote,
} = require('./getEmoteElements')

const parseEmotes = (message, emotes) => {
  if (!message || !emotes) {
    return [{
      type: 'text',
      content: message,
    }]
  }

  const tokens = []
  let lastTokenIndex = 0

  Object.keys(emotes).forEach((key) => {
    emotes[key].forEach((occurrence) => {
      const [startIndex, endIndex] = occurrence.split('-').map(idx => parseInt(idx, 10))

      if (startIndex !== lastTokenIndex) {
        tokens.push({
          type: 'text',
          content: message.slice(lastTokenIndex, startIndex)
        })
      }

      tokens.push({
        type: 'emote',
        content: getEmote(key),
        title: message.slice(startIndex, endIndex + 1),
        key,
      })

      lastTokenIndex = endIndex + 1
    })
  })

  return tokens
}

const parseCheermotes = (message) => {
  // TODO: tokenise cheermotes
  return message
}

const getUserDetails = (userstate = {}) => ({
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

const getMessageDetails = (message, userstate = {}) => ({
  id: userstate.id,
  type: userstate['message-type'],
  emotes: userstate.emotes,
  tokens: parseEmotes(message, userstate.emotes),
  raw: message,
})

module.exports = {
  parseEmotes,
  parseCheermotes,
  getUserDetails,
  getMessageDetails,
}
