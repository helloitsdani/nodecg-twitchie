const { twitch, nodecg, replicants, config } = require('../../context')

const { user, channel, stream } = replicants

let updateTimeout

const fetchFollowers = async () => {
  const follows = await twitch.api.helix.users.getFollows({ followedUser: '31785721' })
  console.log(follows)
  return follows
}

// if a stream is active, the api response will contain the
// channel's information as well; therefore, we only need to
// specifically request it if no stream is active
const fetchInfo = async () => {
  const streamInfo = await twitch.api.helix.streams.getStreamByUserName(channel.id.value)

  if (streamInfo) {
    return {
      stream: streamInfo.stream,
      channel: streamInfo.stream.user,
    }
  } else {
    const channelInfo = await twitch.api.helix.users.getUserByName(channel.id.value)

    console.log(channelInfo._data.display_name)
    return {
      channel: channelInfo,
    }
  }
}

const update = () => {
  updateTimeout = clearTimeout(updateTimeout)

  Promise.all([fetchInfo(), fetchFollowers()])
    .then(([info, followers]) => {
      channel.info.value = Object.assign({}, info.channel)
      channel.followers.value = [...followers]
      stream.info.value = Object.assign({}, info.stream)
    })
    .catch(err => {
      nodecg.log.error("Couldn't retrieve channel info :()", err)
    })
    .then(() => {
      updateTimeout = setTimeout(update, config.timeBetweenUpdates)
    })
}

channel.id.on('change', newUserId => {
  channel.info.value = undefined
  channel.followers.value = undefined
  stream.info.value = undefined

  if (newUserId) {
    update()
  } else {
    updateTimeout = clearTimeout(updateTimeout)
  }
})
