const createTwitchService = require('./service')

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

  return createTwitchService(nodecg)
}
