import context from '../../context'

const { twitch, nodecg, replicants, config } = context
const { user, stream } = replicants

let updateTimeout: NodeJS.Timeout

const fetchFollowers = async () => {
  const follows = await twitch.api!.helix.users.getFollows({ followedUser: user.id.value })
  console.log(follows)
  return follows
}

// if a stream is active, the api response will contain the
// channel's information as well; therefore, we only need to
// specifically request it if no stream is active
const fetchInfo = async () => {
  const streamInfo = await twitch.api!.helix.streams.getStreamByUserId(user.id.value!)

  if (streamInfo) {
    return {
      stream: streamInfo,
    }
  }

  const channelInfo = await twitch.api!.helix.users.getUserById(user.id.value!)

  return {
    channel: channelInfo,
  }
}

const update = () => {
  clearTimeout(updateTimeout)

  Promise.all([fetchInfo(), fetchFollowers()])
    .then(([info, followers]) => {
      // channel.info.value = Object.assign({}, info.channel)
      // channel.followers.value = [...followers]
      // stream.info.value = Object.assign({}, info.stream)
      console.log(info, followers)
    })
    .catch(err => {
      nodecg.log.error("Couldn't retrieve channel info :()", err)
    })
    .then(() => {
      updateTimeout = setTimeout(update, config.timeBetweenUpdates)
    })
}

user.id.on('change', (newUserId: string) => {
  user.info.value = undefined
  user.followers.value = undefined
  stream.info.value = undefined

  if (newUserId) {
    update()
  } else {
    clearTimeout(updateTimeout)
  }
})
