const getEmote = (emote, { size = '3.0' } = {}) =>
  `http://static-cdn.jtvnw.net/emoticons/v1/${emote}/${size}`

module.exports = {
  getEmote,
}
