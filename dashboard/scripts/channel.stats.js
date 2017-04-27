/* global nodecg, moment */

(function () {
  const channelInfo = nodecg.Replicant('channel.info')
  const streamInfo = nodecg.Replicant('stream.info')

  let streamStartedAt
  let timerInterval

  const elements = {
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer')
  }

  const stats = {
    set viewers (value) {
      elements.viewers.innerHTML = value
    },

    set followers (value) {
      elements.followers.innerHTML = value
    },

    set timer (value) {
      timerInterval = clearInterval(timerInterval)

      if (value) {
        streamStartedAt = moment(value)
        timerInterval = setInterval(tick, 1 * 1000)
      } else {
        streamStartedAt = undefined
      }
    }
  }

  const tick = () => {
    var timerText

    if (streamStartedAt) {
      var diff = moment().diff(streamStartedAt)
      timerText = moment(diff).format('H:mm:ss')
    } else {
      timerText = 'Offline'
    }

    elements.timer.innerHTML = timerText
  }

  channelInfo.on(
    'change',
    (newVal) => { stats.followers = newVal.followers }
  )

  streamInfo.on(
    'change',
    (newVal) => {
      if (newVal.stream) {
        stats.viewers = newVal.stream.viewers
        stats.timer = newVal.stream.created_at
      } else {
        stats.viewers = 0
        stats.timer = undefined
      }
    }
  )
}())
