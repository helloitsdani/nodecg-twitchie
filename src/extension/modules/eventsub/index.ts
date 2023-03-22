import { EventSubWsListener } from '@twurple/eventsub-ws'

import context from '../../context'

let eventsub: EventSubWsListener

context.replicants.user.id.on('change', (newUserId) => {
  context.log.debug(`userID: ${newUserId}...`)

  if (eventsub) {
    eventsub.stop()
  }

  if (!newUserId || !context.twitch.api) {
    return
  }

  context.log.debug(`Creating eventsub websocket for userID ${newUserId}...`)

  eventsub = new EventSubWsListener({
    url: 'wss://eventsub.wss.twitch.tv/ws',
    apiClient: context.twitch.api,
  })

  eventsub.onChannelFollow(newUserId, newUserId, (event) => {
    context.events.emitMessage('user.follower', {
      followed_at: event.followDate.getTime(),
      from_id: event.userId,
      from_name: event.userDisplayName,
    })
  })

  eventsub.start()
})
