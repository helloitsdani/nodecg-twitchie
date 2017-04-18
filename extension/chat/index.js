const createChatHandlers = require('./handlers')

module.exports = (nodecg, twitch) => {
  const { channel } = twitch.replicants

  channel.id.on(
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
