const context = require('./context')

const isNodeCGConfigValid = config => (
  config.login.enabled
  && config.login.twitch.enabled
  && config.login.twitch.clientID
)

module.exports = (nodecg) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitchie requires Twitch login to be enabled in your NodeCG config!')
  }

  context.nodecg = nodecg
  context.twitch = require('./client')

  // mount our refresh route under the main nodecg express app
  const service = require('./service')
  nodecg.mount(service)

  const api = require('./api')

  require('./modules/eventLog')
  require('./modules/channel')
  require('./modules/chat')

  // exposes the module's EventEmitter, and proxies requests to the current
  // twitch instance if one exists--we can't just return the twitch object,
  // because we create and destroy it based on user login status
  // this lets other nodecg bundles access the twitch api and recieve events we emit
  return new Proxy(context.events, {
    get: (target, method) => {
      if (method === 'api') {
        return api
      }

      return context.twitch !== undefined && method in context.twitch
        ? context.twitch[method]
        : target[method]
    }
  })
}
