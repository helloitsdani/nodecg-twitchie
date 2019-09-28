import createEventEmitter, { NodeCGEventEmitter } from '../common/events'
import createReplicants, { TwitchieReplicants } from '../common/replicants'

import { TwitchieClientWrapper } from './client'

let nodecgInstance: any
let replicants: TwitchieReplicants
let events: NodeCGEventEmitter
const twitchInstance: TwitchieClientWrapper = new TwitchieClientWrapper()

const getDefaultClientID = (nodecg: any) => nodecg.config.login.twitch.clientID

export default {
  get nodecg() {
    return nodecgInstance
  },
  set nodecg(instance) {
    nodecgInstance = instance
    replicants = createReplicants(nodecgInstance)
    events = createEventEmitter(nodecgInstance)
  },

  get config() {
    return Object.assign({}, { clientID: getDefaultClientID(nodecgInstance) }, nodecgInstance.bundleConfig)
  },
  set config(_) {
    throw new Error('bundleConfig is read from /cfg/nodecg-twitchie.json when NodeCG starts')
  },

  get log() {
    return nodecgInstance ? nodecgInstance.log : console
  },
  set log(_) {
    throw new Error('Logger is created by NodeCG and cannot be overwritten')
  },

  get events() {
    return events
  },
  set events(_) {
    throw new Error('Emitter is initialised when nodecg instance is set')
  },

  get replicants() {
    return replicants
  },
  set replicants(_) {
    throw new Error('Replicants are initialised when nodecg instance is set')
  },

  get twitch() {
    return twitchInstance
  },
  set twitch(_) {
    throw new Error('Twitch client is initialised when nodecg instance is set')
  },
}
