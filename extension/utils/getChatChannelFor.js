// channel IDs need to be normalised for use in twitch irc;
// trying to part #User won't actually make you leave #user
const getChatChannelFor = (channelName) => (
  `#${channelName.toLowerCase()}`
)

module.exports = getChatChannelFor
