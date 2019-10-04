import context from '../../context'

context.replicants.user.followers.on('change', (newValue, oldValue) => {
  if (!oldValue || !newValue) {
    return
  }

  const followers = oldValue.followers.map(follower => follower.from_name)

  newValue.followers.every(follower => {
    const isNewFollower = !followers.includes(follower.from_name)

    if (isNewFollower) {
      context.events.emitMessage('channel.follower', follower)
    }

    return isNewFollower
  })
})
