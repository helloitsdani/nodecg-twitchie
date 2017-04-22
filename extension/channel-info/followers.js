module.exports = (nodecg, twitch) => {
  const { channel } = twitch.replicants

  channel.followers.on(
    'change',
    (newValue, oldValue) => {
      if (!oldValue || !newValue) {
        return
      }

      const followers = oldValue.map(follower => follower.user.name)

      newValue.every((follower) => {
        const isNewFollower = !followers.includes(follower.user.name)

        if (isNewFollower) {
          nodecg.sendMessage('channel.follower', follower)
        }

        return isNewFollower
      })
    }
  )
}
