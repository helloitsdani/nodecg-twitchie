import EventEmitter from 'events'

import { TwitchieEmitFunction } from '../types'

type TwitchieEventEmitter = EventEmitter & {
  emitMessage: TwitchieEmitFunction
}

export { TwitchieEventEmitter }

export default (nodecg: any) => {
  const emitter = new EventEmitter() as TwitchieEventEmitter

  // convenience method for emitting events at the same time as
  // updating/broadcasting channel information
  emitter.emitMessage = (action, payload) => {
    nodecg.sendMessage(action, payload)
    emitter.emit(action, payload)
  }

  return emitter
}
