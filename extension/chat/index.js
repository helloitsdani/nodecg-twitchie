const assetsModule = require('./assets')
const channelModule = require('./channel')

module.exports = (nodecg, events, twitch) => {
  assetsModule(nodecg, events, twitch)
  channelModule(nodecg, events, twitch)
}
