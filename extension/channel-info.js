let channelTimer

module.exports = (nodecg, twitch) => {
  const config = nodecg.bundleConfig

  const channelId = nodecg.Replicant('channel.id')
  const channelInfo = nodecg.Replicant('channel.info')
  const streamInfo = nodecg.Replicant('stream.info')

  const update = () => {
    if (channelTimer) {
      channelTimer = clearTimeout(channelTimer)
    }

    Promise.all([
      twitch.api.getChannelInfo(),
      twitch.api.getStreamInfo(),
    ]).then((response) => {
      channelInfo.value = response[0]
      streamInfo.value = response[1]
    }).catch((err) => {
      console.error('Couldn\'t retrieve channel info :()', err)
    }).then(() => {
      channelTimer = setTimeout(update, config.timeBetweenUpdates || 60000)
    })
  }

  channelId.on('change', update)

  twitch.client.on('hosted', (channel, host, viewers) => nodecg.sendMessage('channel.hosted', { host, viewers }))

  twitch.client.on('subscribe', (channel, username, method) => nodecg.sendMessage('channel.subscribe', { username, method }))
  twitch.client.on('resub', (channel, username, months, message) => nodecg.sendMessage('channel.resub', { username, months, message }))
}
