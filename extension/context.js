const createReplicants = require('../common/replicants')
const createEventEmitter = require('../common/events')

let nodecgInstance
let replicants
let events
let twitchInstance

const getDefaultClientID = nodecg => nodecg.config.login.twitch.clientID

module.exports = {
  get nodecg() {
    return nodecgInstance
  },
  set nodecg(instance) {
    nodecgInstance = instance
    replicants = createReplicants(nodecgInstance)
    events = createEventEmitter(nodecgInstance)
  },

  get config() {
    return Object.assign(
      {},
      { clientID: getDefaultClientID(nodecgInstance) },
      nodecgInstance.bundleConfig
    )
  },
  set config(instance) {
    throw new Error('bundleConfig is read from /cfg/nodecg-twitchie.json when NodeCG starts')
  },

  get log() {
    return nodecgInstance ? nodecgInstance.log : console
  },
  set log(instance) {
    throw new Error('Logger is created by NodeCG and cannot be overwritten')
  },

  get events() {
    return events
  },
  set events(instance) {
    throw new Error('Emitter is initialised when nodecg instance is set')
  },

  get replicants() {
    return replicants
  },
  set replicants(instance) {
    throw new Error('Replicants are initialised when nodecg instance is set')
  },

  get twitch() {
    return twitchInstance
  },
  set twitch(instance) {
    twitchInstance = instance
  },
}
