import context from '../../context'

const { events, replicants } = context
const { user } = replicants

user.followers.on('change', (newValue, oldValue) => {
  if (!oldValue || !newValue) {
    return
  }

  const followers = oldValue.map(follower => follower.userDisplayName)

  newValue.every(follower => {
    const isNewFollower = !followers.includes(follower.userDisplayName)

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
