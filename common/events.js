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

  const channelId = nodecg.Replicant('channel.id', NAMESPACE, {
    defaultValue: undefined,
    persistent: false,
  })

  const eventHistory = nodecg.Replicant('events', NAMESPACE, {
    defaultValue: [],
    persistent: true,
  })

  emitter.addEvent = (subject, action, message) => {
    const channel = channelId.value

    if (!channel) {
      throw new Error('No channel has been set to log events for')
    }

    const events = [ ...eventHistory.value ].slice(0, MAX_STORED_EVENTS - 2)
    const timestamp = Date.now()

    events.unshift({
      subject,
      action,
      message,
      timestamp,
      channel,
    })

    eventHistory.value = events
  }

  return emitter
}
