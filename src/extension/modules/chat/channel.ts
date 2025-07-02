import context from '../../context'

// only try and join a channel when we're sure the provided
// channel id actually resolves to a real user
// trying to join nonexistent channels on twitch irc can
// cause issues
context.replicants.user.info.on('change', async (newUserInfo) => {
  if (!newUserInfo || !context.twitch.client) {
    return
  }

  const newChannel = `#${newUserInfo.login}`

  // don't try to switch channels if we've already joined this user's channel
  if (context.twitch.client.currentChannels.find((channel) => channel === newChannel)) {
    return
  }

  context.log.debug(`Joining ${newChannel}...`)

  context.twitch.client.currentChannels.forEach((channel) => {
    context.twitch.client?.part(channel)
    context.log.debug(`Parted ${channel}`)
  })

  await context.twitch.client.join(newChannel)
  context.log.debug('Joined successfully.')

  context.replicants.chat.channel.value = newUserInfo.login
})
