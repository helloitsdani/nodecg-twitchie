import { ChatClient, ChatSubInfo, ChatUser, ChatMessage as TwitchChatMessage, parseChatMessage } from '@twurple/chat'

import { ChatMessage, ChatMessageType, SubscriberInfo } from '../../types'
import context from '../context'

const serializeSub = (subInfo: ChatSubInfo): SubscriberInfo => ({
  cumulativeMonths: subInfo.months,
  durationMonths: subInfo.months,
  messageText: subInfo.message ?? '',
  streakMonths: subInfo.streak ?? 0,
  tier: subInfo.plan,
  userDisplayName: subInfo.displayName,
  userName: subInfo.displayName,
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

const serializeMessage = (type: ChatMessageType, rawMessage: string, message: TwitchChatMessage): ChatMessage => ({
  id: message.id,
  type,
  user: serializeUser(message.userInfo),
  message: rawMessage,
  tokens: parseChatMessage(rawMessage, message.emoteOffsets, context.replicants.chat.cheermotes.value),
  isCheer: message.isCheer,
  bits: message.bits,
})

export default (client: ChatClient) => {
  client.onAction((channel, _, raw, message) => {
    context.events.emitMessage('chat.action', {
      channel,
      message: serializeMessage(ChatMessageType.action, raw, message),
    })
  })

  client.onMessage((channel, _, raw, message) => {
    context.events.emitMessage('chat.message', {
      channel,
      message: serializeMessage(ChatMessageType.message, raw, message),
    })
  })

  /* subscriptions */
  const giftCounts = new Map<string | undefined, number>()

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

    context.events.emitMessage('user.subscription.gift', {
      gifterDisplayName: subInfo.gifterDisplayName ?? null,
      gifterName: subInfo.gifter ?? null,
      recipientDisplayName: subInfo.displayName,
      recipientName: subInfo.displayName,
      tier: subInfo.plan,
      isAnonymous: false,
      amount: subInfo.months,
      cumulativeAmount: subInfo.months,
    })
  })

  client.onCommunitySub((_, gifter, subInfo) => {
    /*
     * community gift subs send individual sub gift events, too;
     * we keep count here so that those invidual events can be
     * filtered out
     */
    const previousGiftCount = giftCounts.get(gifter) ?? 0
    giftCounts.set(gifter, previousGiftCount + subInfo.count)

    context.events.emitMessage('user.subscription.gift', {
      gifterDisplayName: subInfo.gifterDisplayName ?? null,
      gifterName: subInfo.gifter ?? null,
      recipientDisplayName: null,
      recipientName: null,
      tier: subInfo.plan,
      isAnonymous: false,
      amount: subInfo.count,
      cumulativeAmount: subInfo.gifterGiftCount ?? 0,
    })
  })

  /* rituals */
  client.onRitual((channel, user, ritualInfo) => {
    if (ritualInfo.ritualName === 'new_chatter') {
      context.events.emitMessage('ritual.new', {
        name: user,
        message: ritualInfo.message,
      })
    } else {
      context.events.emitMessage('ritual', {
        channel,
        user,
        message: ritualInfo.message,
        ritualName: ritualInfo.ritualName,
      })
    }
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
