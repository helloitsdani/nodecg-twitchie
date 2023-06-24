import { EventSubWsListener } from '@twurple/eventsub-ws'

import context from '../../context'

let eventsub: EventSubWsListener

context.replicants.user.id.on('change', (newUserId) => {
  if (!newUserId || !context.twitch.api) {
    return
  }

  context.log.debug(`Creating eventsub websocket for userID ${newUserId}...`)

  if (eventsub) {
    context.log.debug('Stopping old eventsub socket...')
    eventsub.stop()
  }

  eventsub = new EventSubWsListener({
    apiClient: context.twitch.api,
  })

  /* Followers */
  eventsub.onChannelFollow(newUserId, newUserId, (event) => {
    context.events.emitMessage('user.follower', {
      followed_at: event.followDate.getTime(),
      from_id: event.userId,
      from_name: event.userDisplayName,
    })
  })

  /* Raids */
  eventsub.onChannelRaidTo(newUserId, (event) => {
    context.events.emitMessage('user.raid', {
      channel: event.raidedBroadcasterDisplayName,
      byChannel: event.raidingBroadcasterDisplayName,
      viewers: event.viewers,
    })
  })

  eventsub.start()
})
