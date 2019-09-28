const { events, replicants } = require('../../context')

const { channel } = replicants

channel.followers.on('change', (newValue, oldValue) => {
  if (!oldValue || !newValue) {
    return
  }

  const followers = oldValue.map(follower => follower.user.name)

  newValue.every(follower => {
    const isNewFollower = !followers.includes(follower.user.name)

    if (isNewFollower) {
      events.emitMessage({
        scope: 'channel',
        action: 'follower',
        payload: follower,
      })
    }

    return isNewFollower
  })
})
