/* global nodecg, moment */

(() => {
  const eventList = document.getElementById('eventList')
  const events = nodecg.Replicant('events', 'nodecg-twitchie')

  events.on('change', (newEvents) => {
    const parsedEvents = (newEvents || [])
      .map((item) => {
        const newItem = Object.assign({}, item)
        const eventDate = moment(item.timestamp)

        newItem.time = eventDate.format('HH:mm')
        newItem.date = eventDate.format('Do MMM')
        return newItem
      })

    eventList.items = parsedEvents
  })
})()
