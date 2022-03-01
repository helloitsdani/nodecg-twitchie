import context from '../../context'

context.replicants.chat.channel.on('change', async (newChannel) => {
  if (!newChannel) {
    context.replicants.chat.cheermotes.value = undefined
    return
  }

  if (!context.twitch.api) {
    throw new Error('No Twitch API instance is available')
  }

  const cheermotes = await context.twitch.api.bits.getCheermotes(newChannel)
  context.replicants.chat.cheermotes.value = cheermotes
})
