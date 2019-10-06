import { FollowersInfo, GameInfo, Replicant, StreamInfo, TwitchieReplicants, UserInfo } from '../types'
import { NAMESPACE } from './constants'

const createReplicant = <T>(
  nodecg: any,
  name: string,
  { defaultValue, persistent }: { defaultValue?: T; persistent?: boolean } = {}
): Replicant<T> =>
  nodecg.Replicant(name, NAMESPACE, {
    defaultValue,
    persistent: !!persistent,
  })

export { createReplicant }

export default (nodecg: any, defaults: any = {}): TwitchieReplicants => {
  const createReplicantWithDefault = <T>(name: string): Replicant<T> => createReplicant(nodecg, name, defaults[name])

  return {
    channel: {
      id: createReplicantWithDefault<string>('channel.id'),
    },

    stream: {
      info: createReplicantWithDefault<StreamInfo>('stream.info'),
    },

    game: {
      id: createReplicantWithDefault<string>('game.id'),
      info: createReplicantWithDefault<GameInfo>('game.info'),
    },

    user: {
      id: createReplicantWithDefault<string>('user.id'),
      info: createReplicantWithDefault<UserInfo>('user.info'),
      followers: createReplicantWithDefault<FollowersInfo>('user.followers'),
    },

    chat: {
      channel: createReplicantWithDefault<string>('chat.channel'),
      badges: createReplicantWithDefault<any>('chat.badges'),
      cheermotes: createReplicantWithDefault<any>('chat.cheermotes'),
    },
  }
}
