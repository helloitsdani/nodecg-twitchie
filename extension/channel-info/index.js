let updateTimeout

module.exports = (nodecg, twitch) => {
  const {
    timeBetweenUpdates = 60000
  } = nodecg.bundleConfig

  const {
    user,
    channel,
    stream
  } = twitch.replicants

  const fetchStreamInfo = () => twitch.api.stream()
    .then((response) => {
      if (!response.stream) {
        return {
          stream: null,
          channel: null,
        }
      }

      return {
        stream: response.stream,
        channel: response.stream.channel,
      }
    })

  const fetchChannelInfo = () => twitch.api.channel()
    .then(channelInfo => ({ channel: channelInfo }))

  const fetchFollowers = () => twitch.api.followers()
    .then(followerInfo => followerInfo.follows)

  // if a stream is active, the api response will contain the
  // channel's information as well; therefore, we only need to
  // specifically request it if no stream is active
  const fetchInfo = () => fetchStreamInfo()
    .then(
      response => (response.channel !== null)
        ? response
        : fetchChannelInfo()
    )

  const update = () => {
    updateTimeout = clearTimeout(updateTimeout)

    Promise.all([
      fetchInfo(),
      fetchFollowers()
    ])
      .then(([info, followers]) => {
        channel.info.value = info.channel
        channel.followers.value = followers
        stream.info.value = info.stream
      }).catch((err) => {
        nodecg.log.error('Couldn\'t retrieve channel info :()', err)
      }).then(() => {
        updateTimeout = setTimeout(update, timeBetweenUpdates)
      })
  }

  user.id.on('change', (newUserId) => {
    channel.info.value = null
    stream.info.value = null

    if (newUserId) {
      update()
    } else {
      updateTimeout = clearTimeout(updateTimeout)
    }
  })
}
