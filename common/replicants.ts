import { HelixFollow, HelixStream, HelixUser } from 'twitch'

import { NAMESPACE } from './constants'

interface Replicant<T> {
  value?: T
  namespace?: string
  on(event: 'change', listener: (newValue: T, oldValue?: T) => void): void
}

interface TwitchieReplicants {
  channel: {
    id: Replicant<string>
  }
  stream: {
    info: Replicant<HelixStream>
  }
  user: {
    id: Replicant<string>
    info: Replicant<HelixUser>
    followers: Replicant<HelixFollow[]>
  }
  chat: {
    badges: Replicant<any>
    cheermotes: Replicant<any>
  }
}

export { Replicant, TwitchieReplicants }

export default (nodecg: any, defaults: any = {}): TwitchieReplicants => {
  const createReplicant = (name: string) =>
    nodecg.Replicant(name, NAMESPACE, {
      defaultValue: defaults[name],
      persistent: false,
    })

  return {
    channel: {
      id: createReplicant('channel.id'),
    },

    stream: {
      info: createReplicant('stream.info'),
    },

    user: {
      id: createReplicant('user.id'),
      info: createReplicant('user.info'),
      followers: createReplicant('user.followers'),
    },

    chat: {
      badges: createReplicant('chat.badges'),
      cheermotes: createReplicant('chat.cheermotes'),
    },
  }
}
