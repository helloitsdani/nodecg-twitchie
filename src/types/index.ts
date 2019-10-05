export interface Replicant<T> {
  value?: T
  namespace?: string
  on(event: 'change', listener: (newValue?: T, oldValue?: T) => void): void
}

export interface GameInfo {
  id: string
  name: string
  box_art_url: string
}

export interface StreamInfo {
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

export interface UserInfo {
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

export interface FollowersInfo {
  total: number
  followers: FollowInfo[]
}

export interface FollowInfo {
  followed_at: number
  from_id: string
  from_name: string
  to_id: string
  to_name: string
}

export interface ChatUser {
  id: string
  name: string
  username: string
  color: string
  badges: Map<string, string>
  isMod: boolean
  isSubscriber: boolean
}

export interface ChatTextMessageToken {
  type: 'text'
  text: string
}

export interface ChatEmoteMessageToken {
  type: 'emote'
  id: string
  name: string
}

export interface ChatCheerMessageToken {
  type: 'cheer'
  name: string
  amount: number
  displayInfo: {
    url: string
    color: string
  }
}

export type ChatMessageToken = ChatTextMessageToken | ChatEmoteMessageToken | ChatCheerMessageToken

export interface MessageTypes {
  'channel.follower': FollowInfo
  'channel.subscription': any
  'chat.action': any
  'chat.message': any
  'chat.clear': undefined
  'chat.ban': any
  'chat.timeout': any
  'channel.hosted': any
}

export type TwitchieEmitFunction = <T extends keyof MessageTypes>(action: T, payload: MessageTypes[T]) => void

export type TwitchieListenFunction = <T extends keyof MessageTypes>(
  action: T,
  callback: (payload: MessageTypes[T]) => void
) => void

export interface TwitchieReplicants {
  channel: {
    id: Replicant<string>
  }
  stream: {
    info: Replicant<StreamInfo>
  }
  game: {
    id: Replicant<string>
    info: Replicant<GameInfo>
  }
  user: {
    id: Replicant<string>
    info: Replicant<UserInfo>
    followers: Replicant<FollowersInfo>
  }
  chat: {
    channel: Replicant<string>
    badges: Replicant<any>
    cheermotes: Replicant<any>
  }
}
