let channelTimer

module.exports = (nodecg, twitch) => {
  const config = nodecg.bundleConfig

  const channelId = nodecg.Replicant('channel.id')
  const channelInfo = nodecg.Replicant('channel.info')
  const streamInfo = nodecg.Replicant('stream.info')

  const update = () => {
    console.log('Updating channel info...')

    if (channelTimer) {
      channelTimer = clearTimeout(channelTimer)
    }

    Promise.all([
      twitch.api.getChannelInfo(),
      twitch.api.getStreamInfo()
    ]).then(response => {
      channelInfo.value = response[0]
      streamInfo.value = response[1]
    }).catch(err => {
      console.log('Couldn\'t retrieve channel info :()', err)
    }).then(() => {
      channelTimer = setTimeout(update, config.timeBetweenUpdates || 60000)
    })
  }

  channelId.on('change', update)
}
