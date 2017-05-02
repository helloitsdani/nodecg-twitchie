const EventEmitter = require('events')

const getMessageKey = (scope, action) => `${scope ? `${scope}.` : ''}${action}`

// create a shared singleton EventEmitter for the entire module
// so we don't have to pass it around everywhere
module.exports = (nodecg) => {
  const events = new EventEmitter()

  // convenience method for emitting events at the same time as
  // updating/broadcasting channel information
  events.emitMessage = ({
    action,
    scope,
    payload = {}
  } = {}) => {
    const key = getMessageKey(scope, action)
    nodecg.sendMessage(key, payload)
    events.emit(key, payload)
  }

  return events
}
