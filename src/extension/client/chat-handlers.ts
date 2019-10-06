import TwitchChatClient, { ChatCommunitySubInfo, ChatSubGiftInfo, ChatSubInfo, ChatUser } from 'twitch-chat-client'
import TwitchPrivateMessage from 'twitch-chat-client/lib/StandardCommands/TwitchPrivateMessage'

import {
  ChatMessage,
  ChatMessageType,
  SubscriberCommunityGiftInfo,
  SubscriberGiftInfo,
  SubscriberInfo,
} from '../../types'
import context from '../context'

const serializeSubscriberInfo = (subInfo: ChatSubInfo): SubscriberInfo => ({
  name: subInfo.displayName,
  message: subInfo.message,
  months: subInfo.months,
  streak: subInfo.streak,
  plan: subInfo.plan,
  planName: subInfo.planName,
  isPrime: subInfo.isPrime,
})

const serializeSubscriberGiftInfo = (subInfo: ChatSubGiftInfo): SubscriberGiftInfo => ({
  ...serializeSubscriberGiftInfo(subInfo),
  gifter: subInfo.gifter,
  gifterDisplayName: subInfo.gifterDisplayName,
  gifterGiftCount: subInfo.gifterGiftCount,
})

const serializeCommunityGiftInfo = (giftInfo: ChatCommunitySubInfo): SubscriberCommunityGiftInfo => ({
  count: giftInfo.count,
  gifter: giftInfo.gifter,
  gifterDisplayName: giftInfo.gifterDisplayName,
  gifterGiftCount: giftInfo.gifterGiftCount,
  plan: giftInfo.plan,
})

const serializeUserInfo = (user: ChatUser) => ({
  id: user.userId,
  name: user.userName,
  username: user.userName,
  color: user.color,
  badges: user.badges,
  isMod: user.isMod,
  isSubscriber: user.isSubscriber,
})

const serializeMessageInfo = (
  type: ChatMessageType,
  rawMessage: string,
  message: TwitchPrivateMessage
): ChatMessage => ({
  type,
  user: serializeUserInfo(message.userInfo),
  message: rawMessage,
  tokens: message.parseEmotesAndBits(context.replicants.chat.cheermotes.value),
  isCheer: message.isCheer,
  totalBits: message.totalBits,
})

export default (client: TwitchChatClient) => {
  client.onJoin(channel => {
    context.events.emitMessage('chat.join', channel)
  })

  client.onAction((channel, _, raw, message) => {
    const payload = {
      channel,
      message: serializeMessageInfo(ChatMessageType.ACTION, raw, message),
    }

    context.events.emitMessage('chat.action', payload)
  })

  client.onPrivmsg((channel, _, raw, message) => {
    const payload = {
      channel,
      message: serializeMessageInfo(ChatMessageType.MESSAGE, raw, message),
    }

    context.events.emitMessage('chat.message', payload)
  })

  /* host */
  client.onHosted((channel, byChannel, auto, viewers) => {
    const payload = {
      channel,
      byChannel,
      auto,
      viewers: viewers || 0,
    }

    context.events.emitMessage('user.hosted', payload)
  })

  // @ts-ignore
  client.onRaid((channel, user, raidInfo, message) => {
    // raid
  })

  /* subscriptions */
  client.onSub((_, __, subInfo) => {
    const payload = serializeSubscriberInfo(subInfo)
    context.events.emitMessage('user.subscription', payload)
  })

  client.onResub((_, __, subInfo) => {
    const payload = serializeSubscriberInfo(subInfo)
    context.events.emitMessage('user.subscription', payload)
  })

  // @ts-ignore
  client.onSubGift((_, __, subInfo) => {
    const payload = serializeSubscriberGiftInfo(subInfo)
    context.events.emitMessage('user.subscription.gift', payload)
  })

  // @ts-ignore
  client.onCommunitySub((channel, user, subInfo) => {
    const payload = serializeCommunityGiftInfo(subInfo)
    context.events.emitMessage('user.subscription.community', payload)
  })

  /* rituals */
  // @ts-ignore
  client.onRitual((channel, user, ritualInfo, message) => {
    // ritual
  })

  /* naughty management options */
  client.onChatClear(() => {
    context.events.emitMessage('chat.clear', undefined)
  })

  client.onMessageRemove((channel, messageId) => {
    const payload = { channel, messageId }
    context.events.emitMessage('chat.removeMessage', payload)
  })

  client.onTimeout((channel, user, reason, duration) => {
    const payload = { channel, user, reason, duration }
    context.events.emitMessage('chat.timeout', payload)
  })

  client.onBan((channel, user, reason) => {
    const payload = { channel, user, reason }
    context.events.emitMessage('chat.ban', payload)
  })
}
