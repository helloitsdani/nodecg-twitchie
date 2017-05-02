module.exports = (nodecg, events, defaults = {}) => {
  const createReplicant = name => nodecg.Replicant(
    name, 'nodecg-twitch-service', {
      defaultValue: defaults[name],
      persistent: false
    }
  )

  return {
    cleanup: () => {
      Object.keys(this).forEach(
        (key) => { this[key].value = undefined }
      )
    },

    channel: {
      id: createReplicant('channel.id'),
      info: createReplicant('channel.info'),
      followers: createReplicant('channel.followers'),
    },

    stream: {
      info: createReplicant('stream.info'),
    },

    user: {
      id: createReplicant('user.id'),
      info: createReplicant('user.info'),
    },
  }
}
