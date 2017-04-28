/* global nodecg, moment */

(() => {
  const channelInfo = nodecg.Replicant('channel.info', 'nodecg-twitch-service')
  const streamInfo = nodecg.Replicant('stream.info', 'nodecg-twitch-service')

  let streamStartedAt

  const elements = {
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer')
  }

  const tick = () => {
    let timerText

    if (streamStartedAt) {
      const diff = moment().diff(streamStartedAt)
      timerText = moment(diff).format('H:mm:ss')
    } else {
      timerText = 'Offline'
    }

    elements.timer.innerHTML = timerText
  }

  setInterval(tick, 1 * 1000)

  const stats = {
    set viewers(value) {
      elements.viewers.innerHTML = value
    },

    set followers(value) {
      elements.followers.innerHTML = value
    },

    set timer(value) {
      streamStartedAt = value ? moment(value) : undefined
      tick()
    }
  }

  channelInfo.on(
    'change',
    (channel) => {
      stats.followers = channel ? channel.followers : 0
    }
  )

  streamInfo.on(
    'change',
    (info) => {
      stats.viewers = info ? info.viewers : 0
      stats.timer = info ? info.created_at : undefined
    }
  )
})()
