const { events } = require('../context')

const parseMessage = ({
  tokens = []
} = {}) => tokens.reduce(
  (message, token) => (
    `${message}${token.content.title || token.content}`
  ), ''
)

events.on(
  'channel.follower',
  follower => events.addEvent(
    follower.user['display-name'] || follower.user.name,
    'followed'
  )
)

events.on(
  'chat.cheer',
  ({ user, cheer, message }) => events.addEvent(
    user['display-name'] || user.username,
    `sent cheers (${cheer.bits} bits)`,
    parseMessage(message)
  )
)

events.on(
  'channel.subscription',
  ({ username, resub, months, message }) => events.addEvent(
    username,
    resub
      ? `resubscribed (${months} months)`
      : 'subscribed',
    parseMessage(message)
  )
)

events.on(
  'channel.hosted',
  ({ host, viewers }) => events.addEvent(
    host,
    `hosted (${viewers} viewers)`
  )
)
