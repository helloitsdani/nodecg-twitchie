const EventEmitter = require('events')

const MAX_STORED_EVENTS = 100
const getMessageKey = (scope, action) => `${scope ? `${scope}.` : ''}${action}`

// create a shared singleton EventEmitter for the entire module
// so we don't have to pass it around everywhere
module.exports = (nodecg) => {
  const emitter = new EventEmitter()

  // convenience method for emitting events at the same time as
  // updating/broadcasting channel information
  emitter.emitMessage = ({
    action,
    scope,
    payload = {}
  } = {}) => {
    const key = getMessageKey(scope, action)
    nodecg.sendMessage(key, payload)
    emitter.emit(key, payload)
  }

  const userId = nodecg.Replicant('user.id', 'nodecg-twitch-service', {
    defaultValue: undefined,
    persistent: false,
  })

  const allEvents = nodecg.Replicant('events', 'nodecg-twitch-service', {
    defaultValue: {},
    persistent: true,
  })

  const currentChannelEvents = nodecg.Replicant('events.current', 'nodecg-twitch-service', {
    defaultValue: [],
    persistent: false,
  })

  userId.on('change', (newValue) => {
    currentChannelEvents.value = allEvents.value[newValue]
  })

  const addEvent = (subject, action, message) => {
    const currentUser = userId.value

    if (!currentUser) {
      return
    }

    const eventStore = allEvents.value
    const channelEvents = (eventStore[userId.value] || []).slice(0, MAX_STORED_EVENTS - 2)
    const timestamp = Date.now()

    channelEvents.unshift({
      timestamp,
      subject,
      action,
      message,
    })

    eventStore[userId.value] = channelEvents
    allEvents.value = eventStore
    currentChannelEvents.value = channelEvents
  }

  emitter.on(
    'channel.follower',
    follower => addEvent(
      follower.user['display-name'] || follower.user.name,
      'followed'
    )
  )

  emitter.on(
    'chat.cheer',
    ({ user, cheer }) => addEvent(
      user['display-name'] || user.username,
      `sent cheers (${cheer.bits} bits)`,
      cheer.message.message
    )
  )

  emitter.on(
    'channel.subscription',
    ({ username, resub, months, message }) => addEvent(
      username,
      resub
        ? `resubscribed (${months} months)`
        : 'subscribed',
      message.message
    )
  )

  emitter.on(
    'channel.hosted',
    ({ host, viewers }) => addEvent(
      host,
      `hosted (${viewers} viewers)`
    )
  )

  emitter.on(
    'chat.join',
    ({ username, self }) => !self && addEvent(
      username,
      'joined chat'
    )
  )

  return emitter
}
