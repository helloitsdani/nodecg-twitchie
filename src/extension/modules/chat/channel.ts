import context from '../../context'
import getChatChannelFor from '../../utils/getChatChannelFor'

const isUserInChannel = (channelName: string) => context.twitch.client.getChannels().includes(channelName)

// leave chat immediately when channel ID is changed;
// there might be a content reason we want to change ASAP
// so we shouldn't wait for user resolution...
context.replicants.channel.id.on('change', (_, oldChannel) => {
  if (!oldChannel) {
    return
  }

  const channelToPart = getChatChannelFor(oldChannel)

  if (!isUserInChannel(channelToPart)) {
    return
  }

  context.twitch.client.part(channelToPart)
})

// only try and join a channel when we're sure the provided
// channel id actually resolves to a real user
// trying to join nonexistent channels on twitch irc can
// cause issues
context.replicants.user.id.on('change', (newUserId: string) => {
  if (!newUserId) {
    return
  }

  const channelToJoin = getChatChannelFor(context.replicants.channel.id.value!)
  context.twitch.client.join(channelToJoin)
})
