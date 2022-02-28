import { ChatClient, ChatCommunitySubInfo, ChatSubGiftInfo, ChatSubInfo, ChatUser } from '@twurple/chat'
import { TwitchPrivateMessage } from '@twurple/chat/lib/commands/TwitchPrivateMessage'

import {
  ChatMessage,
  ChatMessageType,
  SubscriberCommunityGiftInfo,
  SubscriberGiftInfo,
  SubscriberInfo,
} from '../../types'
import context from '../context'

const serializeSub = (subInfo: ChatSubInfo): SubscriberInfo => ({
  name: subInfo.displayName,
  message: subInfo.message,
  months: subInfo.months,
  streak: subInfo.streak,
  plan: subInfo.plan,
  planName: subInfo.planName,
  isPrime: subInfo.isPrime,
})

const serializeSubGift = (subInfo: ChatSubGiftInfo): SubscriberGiftInfo => ({
  name: subInfo.displayName,
  giftDuration: subInfo.giftDuration,
  gifter: subInfo.gifter,
  gifterGiftCount: subInfo.gifterGiftCount,
  message: subInfo.message,
  months: subInfo.months,
  streak: subInfo.streak,
  plan: subInfo.plan,
  planName: subInfo.planName,
  isPrime: subInfo.isPrime,
})

const serializeCommunitySub = (giftInfo: ChatCommunitySubInfo): SubscriberCommunityGiftInfo => ({
  count: giftInfo.count,
  gifter: giftInfo.gifter,
  gifterDisplayName: giftInfo.gifterDisplayName,
  gifterGiftCount: giftInfo.gifterGiftCount,
  plan: giftInfo.plan,
})

const serializeUser = (user: ChatUser) => ({
  id: user.userId,
  name: user.displayName ?? user.userName,
  username: user.userName,
  color: user.color,
  badges: Object.fromEntries(user.badges.entries()),
  isBroadcaster: user.isBroadcaster,
  isFounder: user.isFounder,
  isMod: user.isMod,
  isSubscriber: user.isSubscriber,
  isVip: user.isVip,
})

const serializeMessage = (type: ChatMessageType, rawMessage: string, message: TwitchPrivateMessage): ChatMessage => ({
  id: message.id,
  type,
  user: serializeUser(message.userInfo),
  message: rawMessage,
  tokens: message.parseEmotesAndBits(context.replicants.chat.cheermotes.value, {
    background: 'dark',
    scale: '4',
    state: 'animated',
  }),
  isCheer: message.isCheer,
  bits: message.bits,
})

export default (client: ChatClient) => {
  const giftCounts = new Map<string | undefined, number>()

  client.onAction((channel, _, raw, message) => {
    context.events.emitMessage('chat.action', {
      channel,
      message: serializeMessage(ChatMessageType.ACTION, raw, message),
    })
  })

  client.onMessage((channel, _, raw, message) => {
    context.events.emitMessage('chat.message', {
      channel,
      message: serializeMessage(ChatMessageType.MESSAGE, raw, message),
    })
  })

  /* host */
  client.onHosted((channel, byChannel, auto, viewers) => {
    context.events.emitMessage('user.hosted', {
      channel,
      byChannel,
      auto,
      viewers: viewers || 0,
    })
  })

  client.onRaid((channel, _, raidInfo) => {
    context.events.emitMessage('user.raid', {
      channel,
      byChannel: raidInfo.displayName,
      viewers: raidInfo.viewerCount,
    })
  })

  /* subscriptions */
  client.onSub((_, __, subInfo) => {
    context.events.emitMessage('user.subscription', serializeSub(subInfo))
  })

  client.onResub((_, __, subInfo) => {
    context.events.emitMessage('user.subscription', serializeSub(subInfo))
  })

  client.onSubGift((_, __, subInfo) => {
    const remainingGifts = giftCounts.get(subInfo.gifter) ?? 0

    if (remainingGifts > 0) {
      giftCounts.set(subInfo.gifter, remainingGifts - 1)
      return
    }

    context.events.emitMessage('user.subscription.gift', serializeSubGift(subInfo))
  })

  client.onCommunitySub((_, gifter, subInfo) => {
    /*
     * community gift subs send individual sub gift events, too;
     * we keep count here so that those invidual events can be
     * filtered out
     */
    const previousGiftCount = giftCounts.get(gifter) ?? 0
    giftCounts.set(gifter, previousGiftCount + subInfo.count)

    context.events.emitMessage('user.subscription.community', serializeCommunitySub(subInfo))
  })

  /* rituals */
  client.onRitual((channel, user, ritualInfo) => {
    context.events.emitMessage('chat.ritual', {
      channel,
      user,
      message: ritualInfo.message,
      ritualName: ritualInfo.ritualName,
    })
  })

  /* naughty management options */
  client.onChatClear(() => {
    context.events.emitMessage('chat.clear', undefined)
  })

  client.onMessageRemove((channel, messageId) => {
    context.events.emitMessage('chat.removeMessage', { channel, messageId })
  })

  client.onTimeout((channel, user, duration) => {
    context.events.emitMessage('chat.timeout', { channel, user, duration })
  })

  client.onBan((channel, user) => {
    context.events.emitMessage('chat.ban', { channel, user })
  })
}
