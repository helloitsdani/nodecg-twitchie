const createTwitchService = require('./service')

const isNodeCGConfigValid = config => (
  config.login.enabled
  && config.login.twitch.enabled
)

const isClientIDPresent = config => config.clientID !== undefined

process.on('unhandledRejection', (reason) => {
  console.log(reason)
})

module.exports = (nodecg) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitch-service requires Twitch login to be enabled in your NodeCG config!')
  }

  if (!isClientIDPresent(nodecg.bundleConfig)) {
    throw new Error('nodecg-twitch-service needs to have a Twitch API Client ID to run properly. Please generate one at https://www.twitch.tv/kraken/oauth2/clients/new')
  }

  return createTwitchService(nodecg)
}
