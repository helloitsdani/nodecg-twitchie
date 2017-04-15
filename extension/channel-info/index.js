let channelTimer

const createChatHandlers = require('./handlers')

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
      twitch.api.channel(),
      twitch.api.stream(),
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

  createChatHandlers(nodecg, twitch)
}
