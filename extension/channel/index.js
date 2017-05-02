const watchForNewFollowers = require('./followers')
const pollForChannelInfo = require('./poll')

module.exports = (nodecg, events, twitch) => {
  pollForChannelInfo(nodecg, events, twitch)
  watchForNewFollowers(nodecg, events, twitch)
}
