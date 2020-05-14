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

export interface SubscriberInfo {
  name: string
  months: number
  streak?: number
  message?: string
  plan: string
  planName: string
  isPrime: boolean
}

export interface SubscriberGiftInfo extends SubscriberInfo {
  gifter?: string
  gifterDisplayName?: string
  gifterGiftCount?: number
}

export interface SubscriberCommunityGiftInfo {
  count: number
  gifter?: string
  gifterDisplayName?: string
  gifterGiftCount?: number
  plan: string
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
  id?: string
  name: string
  username: string
  color?: string
  badges: Record<string, string>
  isMod: boolean
  isSubscriber: boolean
}

export enum ChatMessageType {
  ACTION = 'action',
  MESSAGE = 'message',
}

export interface ChatMessage {
  id?: string
  type: ChatMessageType
  user: ChatUser
  message: string
  tokens: ChatMessageToken[]
  isCheer: boolean
  totalBits: number
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

export interface ChatActionPayload {
  channel: string
  message: ChatMessage
}

export interface ChatMessagePayload {
  channel: string
  message: ChatMessage
}

export interface ChatBanPayload {
  channel: string
  user: string
}

export interface ChatTimeoutPayload {
  channel: string
  user: string
  duration: number
}

export interface ChatHostedPayload {
  channel: string
  byChannel: string
  auto: boolean
  viewers: number
}

export interface ChatRaidPayload {
  channel: string
  byChannel: string
  viewers: number
}

export interface ChatRitualPayload {
  channel: string
  user: string
  message: string
  ritualName: string
}

export interface ChatRemoveMessagePayload {
  channel: string
  messageId: string
}

export interface MessageTypes {
  'user.follower': FollowInfo
  'user.subscription': SubscriberInfo
  'user.subscription.gift': SubscriberGiftInfo
  'user.subscription.community': SubscriberCommunityGiftInfo
  'user.hosted': ChatHostedPayload
  'user.raid': ChatRaidPayload
  'chat.action': ChatActionPayload
  'chat.message': ChatMessagePayload
  'chat.ritual': ChatRitualPayload
  'chat.clear': undefined
  'chat.removeMessage': ChatRemoveMessagePayload
  'chat.ban': ChatBanPayload
  'chat.timeout': ChatTimeoutPayload
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
