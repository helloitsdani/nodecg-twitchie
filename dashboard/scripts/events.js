/* global nodecg, moment */

(() => {
  const eventList = document.getElementById('eventList')
  const channelEvents = nodecg.Replicant('events.current', 'nodecg-twitch-service')

  channelEvents.on('change', () => {
    eventList.items = channelEvents.value || []
  })
})()
