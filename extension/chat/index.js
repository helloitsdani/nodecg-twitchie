const createChatHandlers = require('./handlers')

module.exports = (nodecg, twitch) => {
  const channelId = nodecg.Replicant('channel.id')

  channelId.on(
    'change',
    (newChannel, oldChannel) => {
      if (oldChannel) {
        twitch.client.part(`#${oldChannel}`)
      }

      twitch.client.join(`#${newChannel}`)
        .then(
          () => nodecg.sendMessage('chat.clear')
        )
    }
  )

  createChatHandlers(nodecg, twitch)
}
