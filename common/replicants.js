const { NAMESPACE } = require('./constants')

module.exports = (nodecg, defaults = {}) => {
  const createReplicant = name => nodecg.Replicant(
    name, NAMESPACE, {
      defaultValue: defaults[name],
      persistent: false
    }
  )

  return {
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

    chat: {
      badges: createReplicant('chat.badges'),
      cheermotes: createReplicant('chat.cheermotes'),
    }
  }
}
