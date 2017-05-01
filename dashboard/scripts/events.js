/* global nodecg, moment */

(() => {
  const MAX_STORED_EVENTS = 100
  const eventList = document.getElementById('eventList')

  const channelId = nodecg.Replicant('channel.id', 'nodecg-twitch-service')
  const events = nodecg.Replicant('channel.events', 'nodecg-twitch-service', {
    defaultValue: [],
    persistent: true,
  })

  channelId.on('change', (newVal, oldVal) => {
    if (oldVal === undefined) {
      return
    }

    events.value = []
  })

  events.on('change', (newVal) => {
    eventList.items = newVal
  })

  const addEvent = (subject, action, message) => {
    const eventArray = (events.value || []).slice(0, MAX_STORED_EVENTS - 2)

    eventArray.unshift({
      timestamp: moment(Date.now()).format('H:mm'),
      subject,
      action,
      message,
    })

    events.value = eventArray
  }

  // listen for exciting messages from Twitch to show on the dashboard
  const listenFor = (messageName, handler) => nodecg.listenFor(messageName, 'nodecg-twitch-service', handler)

  listenFor(
    'channel.follower',
    follower => addEvent(
      follower.user['display-name'] || follower.user.name,
      'followed you!'
    )
  )

  listenFor(
    'chat.cheer',
    ({ user, cheer }) => addEvent(
      user['display-name'] || user.username,
      `sent cheers! (${cheer.bits} bits)`,
      cheer.message
    )
  )

  listenFor(
    'chat.subscription',
    ({ username, resub, months, message }) => addEvent(
      username,
      resub
        ? `resubscribed! (${months} months)`
        : 'subscribed!',
      message
    )
  )

  listenFor(
    'chat.hosted',
    ({ host, viewers }) => addEvent(
      host,
      `hosted you! (${viewers} viewers)`
    )
  )

  listenFor(
    'chat.join',
    ({ username, self }) => !self && addEvent(
      username,
      'joined chat'
    )
  )
})()
