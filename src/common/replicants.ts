import { NAMESPACE } from './constants'

interface Replicant<T> {
  value?: T
  namespace?: string
  on(event: 'change', listener: (newValue?: T, oldValue?: T) => void): void
}

interface GameInfo {
  id: string
  name: string
  box_art_url: string
}

interface StreamInfo {
  id: string
  user_id: string
  user_name: string
  game_id: string
  type: 'live' | 'vodcast' | ''
  title: string
  viewer_count: number
  started_at: number
  language: string
  thumbnail_url: string
}

interface UserInfo {
  id: string
  login: string
  display_name: string
  description: string
  type: 'staff' | 'admin' | 'global_mod' | ''
  broadcaster_type: 'partner' | 'affiliate' | ''
  profile_image_url: string
  offline_image_url: string
  view_count: number
}

interface FollowInfo {
  followed_at: number
  from_id: string
  from_name: string
  to_id: string
  to_name: string
}

interface TwitchieReplicants {
  channel: {
    id: Replicant<string>
  }
  stream: {
    info: Replicant<StreamInfo>
    game: Replicant<GameInfo>
  }
  user: {
    id: Replicant<string>
    info: Replicant<UserInfo>
    followers: Replicant<FollowInfo[]>
  }
  chat: {
    badges: Replicant<any>
    cheermotes: Replicant<any>
  }
}

export { GameInfo, Replicant, TwitchieReplicants, StreamInfo, UserInfo, FollowInfo }

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
      game: createReplicant('stream.game'),
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
