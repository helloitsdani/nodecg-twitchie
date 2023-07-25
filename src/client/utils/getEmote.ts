export const EMOTE_PREFIX = 'https://static-cdn.jtvnw.net/emoticons/v2/'

const getEmote = (name: string, size = '3.0', type = 'default', theme = 'dark') =>
  `${EMOTE_PREFIX}/${name}/${type}/${theme}/${size}`

export default getEmote
