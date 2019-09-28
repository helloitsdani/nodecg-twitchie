const tokeniseMessage = (message: any, instances: any) => {
  if (!message) {
    return []
  }

  if (!instances) {
    return [
      {
        type: 'text',
        content: message,
      },
    ]
  }

  const tokens = []
  let nextTokenStartIndex = 0

  instances.forEach((instance: any) => {
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

const sortTokens = (a: any, b: any) => {
  if (a.start < b.start) {
    return -1
  }

  if (a.start === b.start) {
    return 0
  }

  return 1
}

const getEmoteTokens = (message: any, emotes: any) => {
  if (!emotes) {
    return []
  }

  const instances: any[] = []

  Object.keys(emotes).forEach(key => {
    emotes[key].forEach((occurrence: any) => {
      const [start, end] = occurrence.split('-').map((idx: any) => parseInt(idx, 10))

      instances.push({
        type: 'emote',
        start,
        end,
        content: {
          title: message.slice(start, end + 1),
          key,
        },
      })
    })
  })

  // make sure that emotes are returned in occurrence order;
  // the twitch emote syntax is first ordered by emote key, then occurrence
  return instances.sort(sortTokens)
}

const getCheermoteTokens = (message: any, cheermotes: any) => {
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
      },
    })

    match = emoteRegex.exec(message)
  }

  return instances
}

const parseEmotes = (message: any, emotes: any) => tokeniseMessage(message, getEmoteTokens(message, emotes))

const parseCheermotes = (message: any, cheermotes: any) =>
  tokeniseMessage(message, getCheermoteTokens(message, cheermotes))

const parseTokens = (tokens: any, tokeniser: any) => {
  const toParse = Array.isArray(tokens)
    ? tokens
    : [
        {
          type: 'text',
          content: tokens,
        },
      ]

  return toParse
    .map(token => (token.type === 'text' ? tokeniser(token.content) : token))
    .reduce((tokenArray, token) => tokenArray.concat(token), [])
}

const getUserDetails = (userstate: any = {}) => ({
  id: userstate['user-id'],
  username: userstate.username,
  'display-name': userstate['display-name'],
  'user-type': userstate['user-type'], // empty, mod, global-mod, admin, staff
  color: userstate.color,
  badges: userstate.badges || [],
  mod: userstate.mod,
  turbo: userstate.turbo,
  subscriber: userstate.subscriber,
  broadcaster: userstate.badges && userstate.badges.broadcaster !== undefined,
})

const getMessageDetails = (message: any, userstate: any = {}) => ({
  id: userstate.id,
  type: userstate['message-type'],
  emotes: userstate.emotes,
  tokens: parseTokens(message, (token: any) => parseEmotes(token, userstate.emotes)),
  raw: message,
})

export {
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
