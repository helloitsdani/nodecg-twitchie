const getEmote = (emote, { size = '3.0' } = {}) =>
  `http://static-cdn.jtvnw.net/emoticons/v1/${emote}/${size}`

const getCheermote = (
  cheermotes,
  name,
  bits,
  {
    type = 'animated',
    background = 'light',
    size = '4',
  } = {}
) =>
  `http://static-cdn.jtvnw.net/bits/${background}/${type}/<color>/${size}`

module.exports = {
  getEmote,
  getCheermote,
}
