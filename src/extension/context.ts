/*
  NodeCG doesn't publish types separately, instead
  recommending that bundles import them relatively.
  This import does mean that the bundle has to be
  compiled from within a NodeCG installation, though...
*/
import { NodeCG } from '../../../../types/server'

import createEventEmitter, { TwitchieEventEmitter } from '../common/events'
import createReplicants from '../common/replicants'
import { TwitchieReplicants } from '../types'
import { TwitchieClientWrapper } from './client'

let nodecgInstance: NodeCG
let replicants: TwitchieReplicants
let events: TwitchieEventEmitter
let twitchInstance: TwitchieClientWrapper

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
    return {
      clientID: nodecgInstance.config.login.twitch?.clientID,
      ...nodecgInstance.bundleConfig,
    }
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

  set twitch(instance: TwitchieClientWrapper) {
    twitchInstance = instance
  },
}
