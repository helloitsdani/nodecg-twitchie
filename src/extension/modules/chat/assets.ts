import context from '../../context'

context.replicants.chat.channel.on('change', async newChannel => {
  if (!newChannel) {
    context.replicants.chat.cheermotes.value = undefined
    return
  }

  if (!context.twitch.api) {
    throw new Error('Twitch api not available')
  }

  const cheermotes = await context.twitch.api.kraken.bits.getCheermotes(newChannel, true)
  context.replicants.chat.cheermotes.value = cheermotes
})
