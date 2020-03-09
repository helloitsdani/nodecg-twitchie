/* global nodecg, NodeCG, Polymer */

import moment from 'moment'

const getCounterText = diff => {
  const diffMoment = moment.utc(diff)

  return diffMoment.format(diffMoment.hours() > 0 ? 'H:mm:ss' : 'm:ss')
}

class TwitchieDurationCounter extends Polymer.Element {
  static get is() {
    return 'twitchie-duration-counter'
  }

  static get properties() {
    return {
      started: {
        type: Number,
        value: 0,
        observer: 'updateTimer',
      },
      fallbackText: {
        type: String,
        value: 'Offline',
      },
    }
  }

  tick() {
    const now = moment.utc()
    const diff = now.diff(this.startedMoment)
    this.counterText = getCounterText(diff)
  }

  updateTimer(newStarted) {
    clearTimeout(this.tickTimer)

    if (!newStarted) {
      this.counterText = this.fallbackText
      return
    }

    this.startedMoment = moment.utc(newStarted)

    this.tick()
    this.tickTimer = setInterval(() => this.tick(), 1 * 1000)
  }
}

customElements.define(TwitchieDurationCounter.is, TwitchieDurationCounter)
