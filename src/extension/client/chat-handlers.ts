import { ChatClient, ChatCommunitySubInfo, ChatSubGiftInfo, ChatSubInfo, ChatUser } from '@twurple/chat'

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
  ...serializeSubscriberInfo(subInfo),
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
  badges: Object.fromEntries(user.badges.entries()),
  isMod: user.isMod,
  isSubscriber: user.isSubscriber,
})

const serializeMessageInfo = (type: ChatMessageType, rawMessage: string, message: any): ChatMessage => ({
  type,
  user: serializeUserInfo(message.userInfo),
  message: rawMessage,
  tokens: message.parseEmotesAndBits(context.replicants.chat.cheermotes.value),
  isCheer: message.isCheer,
  totalBits: message.totalBits,
})

export default (client: ChatClient) => {
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

  client.onRaid((channel, _, raidInfo) => {
    const payload = {
      channel,
      byChannel: raidInfo.displayName,
      viewers: raidInfo.viewerCount,
    }

    context.events.emitMessage('user.raid', payload)
  })

  /* subscriptions */
  client.onSub((_, __, subInfo) => {
    console.log('subscriber', subInfo)
    const payload = serializeSubscriberInfo(subInfo)
    context.events.emitMessage('user.subscription', payload)
  })

  client.onResub((_, __, subInfo) => {
    console.log('resub', subInfo)
    const payload = serializeSubscriberInfo(subInfo)
    context.events.emitMessage('user.subscription', payload)
  })

  client.onSubGift((_, __, subInfo) => {
    console.log('sub gift', subInfo)
    const payload = serializeSubscriberGiftInfo(subInfo)
    context.events.emitMessage('user.subscription.gift', payload)
  })

  client.onCommunitySub((_, __, subInfo) => {
    console.log('community sub', subInfo)
    const payload = serializeCommunityGiftInfo(subInfo)
    context.events.emitMessage('user.subscription.community', payload)
  })

  /* rituals */
  client.onRitual((channel, user, ritualInfo) => {
    const payload = {
      channel,
      user,
      message: ritualInfo.message,
      ritualName: ritualInfo.ritualName,
    }
    context.events.emitMessage('chat.ritual', payload)
  })

  /* naughty management options */
  client.onChatClear(() => {
    context.events.emitMessage('chat.clear', undefined)
  })

  client.onMessageRemove((channel, messageId) => {
    const payload = { channel, messageId }
    context.events.emitMessage('chat.removeMessage', payload)
  })

  client.onTimeout((channel, user, duration) => {
    const payload = { channel, user, duration }
    context.events.emitMessage('chat.timeout', payload)
  })

  client.onBan((channel, user) => {
    const payload = { channel, user }
    context.events.emitMessage('chat.ban', payload)
  })
}
