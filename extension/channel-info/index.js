let channelTimer

module.exports = (nodecg, twitch) => {
  const {
    timeBetweenUpdates = 60000
  } = nodecg.bundleConfig

  const userId = nodecg.Replicant('user.id')
  const channelInfo = nodecg.Replicant('channel.info')
  const streamInfo = nodecg.Replicant('stream.info')

  const update = () => {
    if (channelTimer) {
      channelTimer = clearTimeout(channelTimer)
    }

    Promise.all([
      twitch.api.channel(),
      twitch.api.stream(),
    ]).then((response) => {
      channelInfo.value = response[0]
      streamInfo.value = response[1]
    }).catch((err) => {
      console.error('Couldn\'t retrieve channel info :()', err)
    }).then(() => {
      channelTimer = setTimeout(update, timeBetweenUpdates)
    })
  }

  userId.on('change', (newUserId) => {
    if (newUserId) {
      update()
    } else {
      channelTimer = clearTimeout(channelTimer)
    }
  })
}
