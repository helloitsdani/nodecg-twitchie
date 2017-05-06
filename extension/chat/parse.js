const getEmoteUrl = (emote, size = '3.0') =>
  `http://static-cdn.jtvnw.net/emoticons/v1/${emote}/${size}`

const getEmoteImageElement = (emote, size) =>
  `<img src="${getEmoteUrl(emote, size)}" class="c-twitch-emote" />`

const parseEmotes = (message, emotes) => {
  if (!emotes) {
    return message
  }

  // split the message into an array of characters, and replace the first
  // character of each occurrence of an emote with a full image tag
  // doing this, rather than replacing them inline, ensures that other
  // emote occurrence indices don't shift out of line when we replace
  const chars = message.split('')

  Object.keys(emotes).forEach((key) => {
    emotes[key].forEach((occurrence) => {
      const [startIndex, endIndex] = occurrence.split('-')
      const offset = (endIndex - startIndex) + 1

      const replacementArray = new Array(offset).fill('')
      replacementArray[0] = getEmoteImageElement(key)

      chars.splice(startIndex, offset, ...replacementArray)
    })
  })

  return chars.join('')
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
  message: parseEmotes(message, userstate.emotes),
  raw: message,
})

module.exports = {
  getEmoteUrl,
  getEmoteImageElement,
  parseEmotes,
  getUserDetails,
  getMessageDetails,
}
