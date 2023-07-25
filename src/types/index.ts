import { TwitchieClientWrapper } from '../extension/client'

export interface BundleConfig {
  timeBetweenUpdates: number
  timeBetweenRetries: number
}

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
}

export interface SubscriberInfo {
  cumulativeMonths: number
  durationMonths: number
  messageText: string
  streakMonths: number | null
  tier: string
  userDisplayName: string
  userName: string
}

export interface SubscriberGiftInfo {
  amount: number | null
  cumulativeAmount: number | null
  recipientDisplayName: string | null
  recipientName: string | null
  gifterDisplayName: string | null
  gifterName: string | null
  isAnonymous: boolean
  tier: string
}

export interface FollowInfo {
  followDate: number
  userDisplayName: string
  userName: string
}

export interface CheerInfo {
  bits: number
  isAnonymous: boolean
  message: string
  userName: string | null
  userDisplayName: string | null
}

export interface ShoutoutInfo {
  startDate: number
  viewerCount: number
  shoutedOutBroadcasterName: string
  shoutedOutBroadcasterDisplayName: string
}

export interface NewChatterInfo {
  name: string
  message?: string
}

export interface ChatUser {
  id?: string
  name: string
  username: string
  color?: string
  badges: Record<string, string>
  isBroadcaster: boolean
  isFounder: boolean
  isMod: boolean
  isSubscriber: boolean
  isVip: boolean
}

export enum ChatMessageType {
  action = 'action',
  message = 'message',
}

export interface ChatMessage {
  id: string
  type: ChatMessageType
  user: ChatUser
  message: string
  tokens: ChatMessageToken[]
  isCheer: boolean
  bits: number
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

export interface ChatRaidPayload {
  raidedBroadcasterDisplayName: string
  raidedBroadcasterName: string
  viewers: number
}

export interface ChatRitualPayload {
  channel: string
  user: string
  message?: string
  ritualName: string
}

export interface ChatRemoveMessagePayload {
  channel: string
  messageId: string
}

interface PollChoiceInfo {
  channelPointsVotes: number
  id: string
  title: string
  totalVotes: number
}

interface PollInfo {
  bitsPerVote: number
  channelPointsPerVote: number
  choices: PollChoiceInfo[]
  endDate: number
  id: string
  isBitsVotingEnabled: boolean
  isChannelPointsVotingEnabled: boolean
  startDate: number
  status: 'running' | 'completed' | 'archived' | 'terminated'
  title: string
}

interface PredictionTopPredictorInfo {
  channelPointsUsed: number
  channelPointsWon: number | null
  userDisplayName: string
  userName: string
  userId: string
}

interface PredictionOutcomeInfo {
  channelPoints: number
  users: number
  topPredictors: PredictionTopPredictorInfo[]
}

interface PredictionInfo {
  id: string
  startDate: number
  lockDate: number | null
  endDate: number | null
  outcomes: PredictionOutcomeInfo[]
  title: string
  status: 'running' | 'locked' | 'resolved' | 'canceled'
  winningOutcome: PredictionOutcomeInfo | null
  winningOutcomeId: string | null
}

export interface MessageTypes {
  'user.follower': FollowInfo
  'user.subscription': SubscriberInfo
  'user.subscription.gift': SubscriberGiftInfo
  'user.cheer': CheerInfo
  'user.raid': ChatRaidPayload
  shoutout: ShoutoutInfo
  ritual: ChatRitualPayload
  'ritual.new': NewChatterInfo
  'poll.begin': PollInfo
  'poll.progress': PollInfo
  'poll.end': PollInfo
  'prediction.begin': PredictionInfo
  'prediction.progress': PredictionInfo
  'prediction.lock': PredictionInfo
  'prediction.end': PredictionInfo
  'chat.action': ChatActionPayload
  'chat.message': ChatMessagePayload
  'chat.clear': undefined
  'chat.removeMessage': ChatRemoveMessagePayload
  'chat.ban': ChatBanPayload
  'chat.timeout': ChatTimeoutPayload
}

export type TwitchieEmitFunction = <T extends keyof MessageTypes>(action: T, payload: MessageTypes[T]) => void

export type TwitchieListenFunction = <T extends keyof MessageTypes>(
  action: T,
  callback: (payload: MessageTypes[T]) => void,
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
  }
  chat: {
    channel: Replicant<string>
  }
}

export type TwitchieExtension = {
  replicants: TwitchieReplicants
  client: TwitchieClientWrapper['client']
  api: TwitchieClientWrapper['api']
  on: TwitchieListenFunction
}

export type TwitchieClient = TwitchieReplicants & {
  on: TwitchieListenFunction
}
