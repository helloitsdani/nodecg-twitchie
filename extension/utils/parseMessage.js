const tokeniseMessage = (message, instances) => {
  if (!message) {
    return []
  }

  if (!instances) {
    return [{
      type: 'text',
      content: message,
    }]
  }

  const tokens = []
  let nextTokenStartIndex = 0

  instances.forEach((instance) => {
    if (instance.start !== nextTokenStartIndex) {
      tokens.push({
        type: 'text',
        content: message.slice(nextTokenStartIndex, instance.start),
      })
    }

    tokens.push({
      type: instance.type,
      content: instance.content,
    })

    nextTokenStartIndex = instance.end + 1
  })

  if (nextTokenStartIndex !== message.length) {
    tokens.push({
      type: 'text',
      content: message.slice(nextTokenStartIndex),
    })
  }

  return tokens
}

const sortTokens = (a, b) => {
  if (a.start < b.start) {
    return -1
  }

  if (a.start === b.start) {
    return 0
  }

  return 1
}

const getEmoteTokens = (message, emotes) => {
  if (!emotes) {
    return []
  }

  const instances = []

  Object.keys(emotes).forEach((key) => {
    emotes[key].forEach((occurrence) => {
      const [start, end] = occurrence.split('-').map(
        (idx) => parseInt(idx, 10)
      )

      instances.push({
        type: 'emote',
        start,
        end,
        content: {
          title: message.slice(start, end + 1),
          key,
        }
      })
    })
  })

  // make sure that emotes are returned in occurrence order;
  // the twitch emote syntax is first ordered by emote key, then occurrence
  return instances.sort(sortTokens)
}

const getCheermoteTokens = (message, cheermotes) => {
  if (!cheermotes) {
    return []
  }

  const instances = []

  const emoteNames = Object.keys(cheermotes).join('|')
  const emoteRegex = new RegExp(`\\b(${emoteNames})(\\d+)\\b`, 'ig')

  let match = emoteRegex.exec(message)

  while (match !== null) {
    instances.push({
      type: 'cheer',
      start: match.index,
      end: emoteRegex.lastIndex - 1,
      content: {
        title: `${match[1]}${match[2]}`,
        key: match[1],
        bits: match[2],
      }
    })

    match = emoteRegex.exec(message)
  }

  return instances
}

const parseEmotes = (message, emotes) =>
  tokeniseMessage(
    message,
    getEmoteTokens(message, emotes)
  )

const parseCheermotes = (message, cheermotes) =>
  tokeniseMessage(
    message,
    getCheermoteTokens(message, cheermotes)
  )

const parseTokens = (tokens, tokeniser) => {
  const toParse = Array.isArray(tokens)
    ? tokens
    : [{
      type: 'text',
      content: tokens
    }]

  return toParse.map(
    (token) => token.type === 'text' ? tokeniser(token.content) : token
  ).reduce(
    (tokenArray, token) => tokenArray.concat(token), []
  )
}

const getUserDetails = (userstate = {}) => ({
  id: userstate['user-id'],
  username: userstate.username,
  'display-name': userstate['display-name'],
  'user-type': userstate['user-type'], // empty, mod, global-mod, admin, staff
  color: userstate.color,
  badges: userstate.badges || [],
  mod: userstate.mod,
  turbo: userstate.turbo,
  subscriber: userstate.subscriber,
  broadcaster: (userstate.badges && userstate.badges.broadcaster !== undefined)
})

const getMessageDetails = (message, userstate = {}) => ({
  id: userstate.id,
  type: userstate['message-type'],
  emotes: userstate.emotes,
  tokens: parseTokens(
    message,
    (token) => parseEmotes(token, userstate.emotes)
  ),
  raw: message,
})

module.exports = {
  tokeniseMessage,
  sortTokens,
  getEmoteTokens,
  getCheermoteTokens,
  parseEmotes,
  parseCheermotes,
  parseTokens,
  getUserDetails,
  getMessageDetails,
}
