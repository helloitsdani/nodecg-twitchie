import TwitchChatClient from 'twitch-chat-client'

// import { getMessageDetails, getUserDetails, parseCheermotes, parseTokens } from '../utils/parseMessage'

import context from '../context'

export default (client: TwitchChatClient) => {
  // @ts-ignore
  client.onAction((channel, user, _, message) => {
    // const message = getMessageDetails(messageText, userstate)
    // const user = getUserDetails(userstate)
    // const payload = {
    //   channel,
    //   user,
    //   message,
    // }
    // context.events.emitMessage('chat.action', payload)
  })

  // @ts-ignore
  client.onPrivmsg((channel, user, _, message) => {
    // const message = getMessageDetails(messageText, userstate)
    // const user = getUserDetails(userstate)
    // const payload = {
    //   channel,
    //   user,
    //   message,
    // }
    // context.events.emitMessage('chat.chat', payload)
    console.log(message.userInfo.badges)
    message.parseEmotesAndBits(context.replicants.chat.cheermotes.value).map(console.log)
  })

  /* host */
  // @ts-ignore
  client.onHosted((channel, hosterChannel, auto, viewers) => {
    const payload = { channel, host: hosterChannel, viewers, auto }
    context.events.emitMessage('channel.hosted', payload)
  })

  // @ts-ignore
  client.onRaid((channel, user, raidInfo, message) => {
    // raid
  })

  /* subscriptions */
  // @ts-ignore
  client.onSub((channel, user, subInfo, message) => {
    // const payload = {
    //   channel,
    //   username,
    //   resub: false,
    //   prime: !!extra.prime,
    // }
    // context.events.emitMessage('channel.subscription', payload)
  })

  // @ts-ignore
  client.onResub((channel, user, subInfo, message) => {
    // const message = getMessageDetails(messageText)
    // const payload = {
    //   channel,
    //   username,
    //   months,
    //   message,
    //   resub: true,
    //   prime: !!extra.prime,
    // }
    // context.events.emitMessage('channel.subscription', payload)
  })

  // @ts-ignore
  client.onSubGift((channel, user, subInfo, message) => {
    // sub gift
  })

  // @ts-ignore
  client.onCommunitySub((channel, user, subinfo, message) => {
    // community sub gifts
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

  // @ts-ignore
  client.onMessageRemove((channel, messageId, message) => {
    // naughty
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
