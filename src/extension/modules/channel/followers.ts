import context from '../../context'

context.replicants.user.followers.on('change', (newValue, oldValue) => {
  if (!oldValue || !newValue) {
    return
  }

  const followers = oldValue.map(follower => follower.from_name)

  newValue.every(follower => {
    const isNewFollower = !followers.includes(follower.from_name)

    if (isNewFollower) {
      context.events.emitMessage({
        scope: 'channel',
        action: 'follower',
        payload: follower,
      })
    }

    return isNewFollower
  })
})
