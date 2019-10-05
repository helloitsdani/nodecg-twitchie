import { FollowersInfo, GameInfo, Replicant, StreamInfo, TwitchieReplicants, UserInfo } from '../types'
import { NAMESPACE } from './constants'

export default (nodecg: any, defaults: any = {}): TwitchieReplicants => {
  const createReplicant = <T>(name: string): Replicant<T> =>
    nodecg.Replicant(name, NAMESPACE, {
      defaultValue: defaults[name],
      persistent: false,
    })

  return {
    channel: {
      id: createReplicant<string>('channel.id'),
    },

    stream: {
      info: createReplicant<StreamInfo>('stream.info'),
    },

    game: {
      id: createReplicant<string>('game.id'),
      info: createReplicant<GameInfo>('game.info'),
    },

    user: {
      id: createReplicant<string>('user.id'),
      info: createReplicant<UserInfo>('user.info'),
      followers: createReplicant<FollowersInfo>('user.followers'),
    },

    chat: {
      channel: createReplicant<string>('chat.channel'),
      cheermotes: createReplicant<any>('chat.cheermotes'),
    },
  }
}
