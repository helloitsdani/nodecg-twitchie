const createChatHandlers = require('./handlers')

module.exports = (nodecg, twitch) => {
  const { channel, user } = twitch.replicants

  const isUserInChannel = channelId =>
    twitch.client.getChannels().includes(`#${channelId}`)

  // leave chat immediately when channel ID is changed;
  // there might be a content reason we want to change ASAP
  // so we shouldn't wait for user resolution...
  channel.id.on(
    'change',
    (newChannel, oldChannel) => {
      if (!oldChannel || !isUserInChannel(oldChannel)) {
        return
      }

      twitch.client.part(`#${oldChannel}`)
    }
  )

  // only try and join a channel when we're sure the provided
  // channel id actually resolves to a real user
  // trying to join nonexistent channels on twitch irc can
  // cause issues
  user.id.on(
    'change',
    (newUserId) => {
      if (!newUserId || isUserInChannel(channel.id.value)) {
        return
      }

      twitch.client.join(`#${channel.id.value}`)
    }
  )

  createChatHandlers(nodecg, twitch)
}
