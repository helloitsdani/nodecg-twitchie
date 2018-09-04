/* global NodeCG, moment */

(async () => {
  const eventList = document.getElementById('eventList')
  const events = NodeCG.Replicant('events', 'nodecg-twitchie')

  await NodeCG.waitForReplicants(events)

  events.on(
    'change',
    (newEvents) => {
      const parsedEvents = (newEvents || [])
        .map((item) => {
          const newItem = Object.assign({}, item)
          const eventDate = moment.utc(item.timestamp)

          newItem.time = eventDate.format('HH:mm')
          newItem.date = eventDate.format('Do MMM')
          return newItem
        })

      eventList.items = parsedEvents
    }
  )
})()
