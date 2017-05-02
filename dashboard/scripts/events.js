/* global nodecg, moment */

(() => {
  const MAX_STORED_EVENTS = 100
  const eventList = document.getElementById('eventList')

  const userId = nodecg.Replicant('user.id', 'nodecg-twitch-service')
  const events = nodecg.Replicant('events', 'nodecg-twitch-service', {
    defaultValue: {},
    persistent: true,
  })

  const getEventsForCurrentChannel = () => {
    if (!events.value || !userId.value) {
      return []
    }

    return events.value[userId.value] || []
  }

  const updateEventList = () => {
    eventList.items = getEventsForCurrentChannel()
  }

  userId.on('change', updateEventList)
  events.on('change', updateEventList)

  const addEvent = (subject, action, message) => {
    const eventStore = events.value
    const channelEvents = getEventsForCurrentChannel().slice(0, MAX_STORED_EVENTS - 2)
    const timestamp = Date.now()

    channelEvents.unshift({
      time: moment(timestamp).format('HH:mm'),
      timestamp,
      subject,
      action,
      message,
    })

    eventStore[userId.value] = channelEvents
    events.value = eventStore
  }

  // listen for exciting messages from Twitch to show on the dashboard
  const listenFor = (messageName, handler) => nodecg.listenFor(messageName, 'nodecg-twitch-service', handler)

  listenFor(
    'channel.follower',
    follower => addEvent(
      follower.user['display-name'] || follower.user.name,
      'followed'
    )
  )

  listenFor(
    'chat.cheer',
    ({ user, cheer }) => addEvent(
      user['display-name'] || user.username,
      `sent cheers (${cheer.bits} bits)`,
      cheer.message
    )
  )

  listenFor(
    'chat.subscription',
    ({ username, resub, months, message }) => addEvent(
      username,
      resub
        ? `resubscribed (${months} months)`
        : 'subscribed',
      message
    )
  )

  listenFor(
    'chat.hosted',
    ({ host, viewers }) => addEvent(
      host,
      `hosted (${viewers} viewers)`
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
