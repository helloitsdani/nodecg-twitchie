export const CHEERMOTE_PREFIX = 'http://static-cdn.jtvnw.net/bits/'

const getCheermote = (name: string, size = '3', type = 'animated', theme = 'dark') =>
  `${CHEERMOTE_PREFIX}/${theme}/${type}/${name}/${size}`

export default getCheermote
