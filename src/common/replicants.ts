import { FollowersInfo, GameInfo, Replicant, StreamInfo, TwitchieReplicants, UserInfo } from '../types'
import { NAMESPACE } from './constants'

interface ReplicantOptionsBag<T> {
  defaultValue?: T
  persistent?: boolean
}

const createReplicant = <T>(
  nodecg: any,
  name: string,
  { defaultValue, persistent = true }: ReplicantOptionsBag<T> = {},
): Replicant<T> =>
  nodecg.Replicant(name, NAMESPACE, {
    defaultValue,
    persistent: !!persistent,
  })

export { ReplicantOptionsBag, createReplicant }

export default (nodecg: any, defaults: any = {}): TwitchieReplicants => {
  const createReplicantWithDefault = <T>(name: string, persistent?: boolean): Replicant<T> =>
    createReplicant(nodecg, name, { persistent, defaultValue: defaults[name] })

  return {
    channel: {
      id: createReplicantWithDefault<string>('channel.id', false),
    },

    stream: {
      info: createReplicantWithDefault<StreamInfo>('stream.info', false),
    },

    game: {
      id: createReplicantWithDefault<string>('game.id', false),
      info: createReplicantWithDefault<GameInfo>('game.info', false),
    },

    user: {
      id: createReplicantWithDefault<string>('user.id', false),
      info: createReplicantWithDefault<UserInfo>('user.info', false),
      followers: createReplicantWithDefault<FollowersInfo>('user.followers', false),
    },

    chat: {
      channel: createReplicantWithDefault<string>('chat.channel', false),
      badges: createReplicantWithDefault<any>('chat.badges', false),
      cheermotes: createReplicantWithDefault<any>('chat.cheermotes', false),
    },
  }
}
