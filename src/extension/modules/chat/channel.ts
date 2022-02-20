import context from '../../context'

// leave chat immediately when channel ID is changed;
// there might be a content reason we want to change ASAP
// so we shouldn't wait for user resolution...
context.replicants.channel.id.on('change', (_, oldChannel) => {
  if (!oldChannel) {
    return
  }

  if (!context.twitch.client) {
    return
  }

  try {
    context.log.debug(`Parting ${oldChannel}...`)
    context.twitch.client.part(oldChannel)
    context.log.debug('Parted successfully.')
  } catch (e) {
    // Oh No!!
    context.log.error('Failed to part old channel', e)
  }
})

// only try and join a channel when we're sure the provided
// channel id actually resolves to a real user
// trying to join nonexistent channels on twitch irc can
// cause issues
context.replicants.user.info.on('change', async (newUserInfo) => {
  if (!newUserInfo) {
    return
  }

  if (!context.twitch.client) {
    return
  }

  context.log.debug(`Joining #${newUserInfo.login}...`)
  await context.twitch.client.join(newUserInfo.login)
  context.log.debug('Joined successfully.')

  context.replicants.chat.channel.value = newUserInfo.login
})
