let updateTimeout

module.exports = (nodecg, twitch) => {
  const {
    timeBetweenUpdates = 60000
  } = nodecg.bundleConfig

  const {
    userId,
    channelInfo,
    streamInfo
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
    .then(channel => ({ channel }))

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

    fetchInfo()
      .then((response) => {
        channelInfo.value = response.channel
        streamInfo.value = response.stream
      }).catch((err) => {
        console.error('Couldn\'t retrieve channel info :()', err)
      }).then(() => {
        updateTimeout = setTimeout(update, timeBetweenUpdates)
      })
  }

  userId.on('change', (newUserId) => {
    channelInfo.value = null
    streamInfo.value = null

    if (newUserId) {
      update()
    } else {
      updateTimeout = clearTimeout(updateTimeout)
    }
  })
}
