const context = require('./context')

const isNodeCGConfigValid = config => (
  config.login.enabled
  && config.login.twitch.enabled
)

const isClientIDPresent = config => config.clientID !== undefined

module.exports = (nodecg) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitchie requires Twitch login to be enabled in your NodeCG config!')
  }

  if (!isClientIDPresent(nodecg.bundleConfig)) {
    throw new Error('nodecg-twitchie needs to have a Twitch API Client ID to run properly. Please generate one at https://www.twitch.tv/kraken/oauth2/clients/new')
  }

  context.nodecg = nodecg
  context.twitch = require('./twitch')

  const api = require('./api')
  require('./service')
  require('./eventLog')
  require('./channel')
  require('./chat')

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
