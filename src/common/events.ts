import EventEmitter from 'events'

const getMessageKey = (scope?: string, action?: string) => `${scope ? `${scope}.` : ''}${action}`

interface EmitMessageParamsBag {
  action?: string
  scope?: string
  payload?: any
}

type NodeCGEventEmitter = EventEmitter & {
  emitMessage: (params: EmitMessageParamsBag) => void
}

export { NodeCGEventEmitter, EmitMessageParamsBag }

export default (nodecg: any) => {
  const emitter = new EventEmitter() as NodeCGEventEmitter

  // convenience method for emitting events at the same time as
  // updating/broadcasting channel information
  emitter.emitMessage = ({ action, scope, payload }) => {
    const key = getMessageKey(scope, action)
    nodecg.sendMessage(key, payload)
    emitter.emit(key, payload)
  }

  return emitter
}
