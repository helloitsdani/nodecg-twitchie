module.exports = (nodecg, defaults = {}) => {
  const createReplicant = name => nodecg.Replicant(
    name, 'nodecg-twitch-service', {
      defaultValue: defaults[name],
      persistent: false
    }
  )

  return {
    cleanup: () => {
      Object.keys(this).forEach(
        (key) => { this[key].value = null }
      )
    },

    channelId: createReplicant('channel.id'),
    channelInfo: createReplicant('channel.info'),
    streamInfo: createReplicant('stream.info'),
    userId: createReplicant('user.id'),
    userInfo: createReplicant('user.info'),
  }
}
