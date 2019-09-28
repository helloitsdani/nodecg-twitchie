import context from './context'

const isNodeCGConfigValid = (config: any) =>
  config.login.enabled && config.login.twitch.enabled && config.login.twitch.clientID

module.exports = async (nodecg: any) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitchie requires Twitch login to be enabled in your NodeCG config!')
  }

  context.nodecg = nodecg

  // mount our refresh route under the main nodecg express app
  const service = require('./service')
  nodecg.mount(service)

  require('./modules/channel')
  require('./modules/chat')

  // exposes the module's EventEmitter, and proxies requests to the current
  // twitch instance if one exists--we can't just return the twitch object,
  // because we create and destroy it based on user login status
  // this lets other nodecg bundles access the twitch api and recieve events we emit
  return new Proxy(context.events, {
    get: (target, method) => {
      if (method === 'replicants') {
        return context.replicants
      }

      if (method === 'api') {
        return context.twitch.api
      }

      if (method === 'client') {
        return context.twitch.client
      }

      return (target as any)[method]
    },
  })
}
