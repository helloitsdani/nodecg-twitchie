module.exports = (nodecg, twitch) => {
  const channelId = nodecg.Replicant('channel.id')

  twitch.client.on(
    'chat',
    (channel, user, message, self) => {
      if (user.username.toUpperCase() === channelId.value.toUpperCase()) {
        user.owner = true
      }

      user.badges = []

      if (user.owner) {
        user.badges.push('owner')
      } else if (user.mod) {
        user.badges.push('mod')
      }

      if (user.turbo) {
        user.badges.push('turbo')
      }

      nodecg.sendMessage('chat.message', {
        channel: channel,
        user: user,
        message: message
      })
    }
  )

  channelId.on(
    'change',
    (newVal, oldVal) => {
      if (oldVal) {
        twitch.client.part(`#${oldVal}`)
      }

      twitch.client.join(`#${newVal}`).then(() => {
        nodecg.sendMessage('chat.join', {
          channel: '#' + newVal
        })
      })
    }
  )
}
