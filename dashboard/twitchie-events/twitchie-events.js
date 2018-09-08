/* global nodecg, NodeCG, moment, Polymer */

(() => {
  const channelId = NodeCG.Replicant('channel.id', 'nodecg-twitchie')
  const events = NodeCG.Replicant('events', 'nodecg-twitchie')

  const decorateEventsWithFormattedDates = (event) => {
    const eventDate = moment.utc(event.timestamp)

    return {
      ...event,
      time: eventDate.format('HH:mm'),
      date: eventDate.format('Do MMM'),
    }
  }

  class TwitchieEvents extends Polymer.Element {
    static get is() {
      return 'twitchie-events'
    }

    static get properties() {
      return {
        events: {
          type: Array,
          value: [],
        },
        channelId: {
          type: String,
        },
        channelEvents: {
          type: Array,
          computed: 'filterEventsForChannel(events, channelId)',
        },
      }
    }

    filterEventsForChannel(eventList, currentChannel) {
      return eventList.filter(
        ({ channel }) => channel === currentChannel,
      )
    }

    async ready() {
      super.ready()
      await NodeCG.waitForReplicants(channelId, events)

      channelId.on(
        'change',
        (newChannelId) => {
          this.channelId = newChannelId
        }
      )

      events.on(
        'change',
        (newEvents) => {
          this.events = (newEvents || [])
            .map(decorateEventsWithFormattedDates)
        }
      )
    }
  }

  customElements.define(TwitchieEvents.is, TwitchieEvents)
})()
