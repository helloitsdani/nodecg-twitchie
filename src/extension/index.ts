import { TwitchieExtension } from '../types'
import { NodeCG } from '../../../../types/server'

import { TwitchieClientWrapper } from './client'
import context from './context'

const isNodeCGConfigValid = (config: NodeCG['config']) =>
  config.login.enabled && config.login.twitch?.enabled && config.login.twitch.clientID

module.exports = (nodecg: NodeCG) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitchie requires Twitch login to be enabled in your NodeCG config!')
  }

  context.nodecg = nodecg
  context.twitch = new TwitchieClientWrapper()

  // mount our refresh route under the main nodecg express app
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const service = require('./service')
  nodecg.mount(service)

  require('./modules/user')
  require('./modules/channel')
  require('./modules/chat')

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
