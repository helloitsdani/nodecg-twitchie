import { TwitchieExtension } from '../types'
import { NodeCG, NodeCGConfig } from '../../../../types/server'

import { TwitchieClientWrapper } from './client'
import context from './context'

const isNodeCGConfigValid = (config: NodeCGConfig) =>
  config.login.enabled && config.login.twitch?.enabled && config.login.twitch.clientID

module.exports = (nodecg: NodeCG) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitchie requires Twitch login to be enabled in your NodeCG config!')
  }

  context.nodecg = nodecg
  context.twitch = new TwitchieClientWrapper()

  require('./modules/login')
  require('./modules/user')
  require('./modules/channel')
  require('./modules/chat')
  require('./modules/debug')

  const twitchieExtension: TwitchieExtension = {
    get replicants() {
      return context.replicants
    },

    get api() {
      return context.twitch.api
    },

    get client() {
      return context.twitch.client
    },

    on(name, handler) {
      return context.events.addListener(name, handler)
    },
  }

  return twitchieExtension
}
