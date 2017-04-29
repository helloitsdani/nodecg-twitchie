const watchForNewFollowers = require('./followers')
const pollForChannelInfo = require('./poll')

module.exports = (nodecg, twitch) => {
  pollForChannelInfo(nodecg, twitch)
  watchForNewFollowers(nodecg, twitch)
}
