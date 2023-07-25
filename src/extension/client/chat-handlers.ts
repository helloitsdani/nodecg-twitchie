import { ChatClient, ChatSubInfo, ChatUser, ChatMessage as TwitchChatMessage, parseChatMessage } from '@twurple/chat'

import { ChatMessage, ChatMessageType, SubscriberInfo } from '../../types'
import context from '../context'
import { HelixCheermoteList } from '@twurple/api'

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

const serializeMessage = (
  type: ChatMessageType,
  rawMessage: string,
  message: TwitchChatMessage,
  cheermotes: HelixCheermoteList,
): ChatMessage => {
  const serializedMessage = {
    id: message.id,
    type,
    user: serializeUser(message.userInfo),
    message: rawMessage,
    tokens: parseChatMessage(rawMessage, message.emoteOffsets, cheermotes.getPossibleNames()),
    isCheer: message.isCheer,
    bits: message.bits,
  } as ChatMessage

  serializedMessage.tokens = serializedMessage.tokens.map((token) => {
    if (token.type !== 'cheer') {
      return token
    }

    return {
      ...token,
      /* the cheermote info can't be sent across the ws to our graphics as it's all in twurple instances,
         so we have to hardcode the URL for now */
      displayInfo: cheermotes.getCheermoteDisplayInfo(token.name, token.amount, {
        scale: '3',
        state: 'animated',
        background: 'dark',
      }),
    }
  })

  return serializedMessage
}

export default (client: ChatClient) => {
  let cheermotes: HelixCheermoteList

  context.replicants.chat.channel.on('change', async (newChannel) => {
    if (!newChannel) {
      return
    }

    if (!context.twitch.api) {
      throw new Error('No Twitch API instance is available')
    }

    cheermotes = await context.twitch.api.bits.getCheermotes(newChannel)
  })

  client.onAction((channel, _, raw, message) => {
    context.events.emitMessage('chat.action', {
      channel,
      message: serializeMessage(ChatMessageType.action, raw, message, cheermotes),
    })
  })

  client.onMessage((channel, _, raw, message) => {
    context.events.emitMessage('chat.message', {
      channel,
      message: serializeMessage(ChatMessageType.message, raw, message, cheermotes),
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
