const EventEmitter = require('events')

const { MAX_STORED_EVENTS, NAMESPACE } = require('./constants')

const getMessageKey = (scope, action) => `${scope ? `${scope}.` : ''}${action}`

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

  const userId = nodecg.Replicant('user.id', NAMESPACE, {
    defaultValue: undefined,
    persistent: false,
  })

  const allEvents = nodecg.Replicant('events', NAMESPACE, {
    defaultValue: {},
    persistent: true,
  })

  const currentChannelEvents = nodecg.Replicant('events.current', NAMESPACE, {
    defaultValue: [],
    persistent: false,
  })

  userId.on('change', (newValue) => {
    currentChannelEvents.value = allEvents.value[newValue]
  })

  emitter.addEvent = (subject, action, message) => {
    const currentUser = userId.value

    if (!currentUser) {
      throw new Error('No user has been set to log events for')
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

  return emitter
}
