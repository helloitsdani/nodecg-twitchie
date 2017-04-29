/* global nodecg, moment */

(() => {
  const channelInfo = nodecg.Replicant('channel.info', 'nodecg-twitch-service')
  const streamInfo = nodecg.Replicant('stream.info', 'nodecg-twitch-service')
  const loggedInStatus = nodecg.Replicant('login.status', 'nodecg-twitch-service')
  const userInfo = nodecg.Replicant('user.info', 'nodecg-twitch-service')

  let streamStartedAt

  const elements = {
    sections: {
      login: document.getElementById('login-section'),
      channel: document.getElementById('channel-section'),
    },

    panels: {
      error: document.getElementById('error-panel'),
      info: document.getElementById('info-panel'),
    },

    loading: document.getElementById('loading'),
    stats: document.getElementById('stats'),
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer'),
  }

  loggedInStatus.on(
    'change',
    (isLoggedIn) => {
      elements.sections.login.style.display = isLoggedIn ? 'none' : 'block'
      elements.sections.channel.style.display = isLoggedIn ? 'block' : 'none'
    }
  )

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

  userInfo.on(
    'change',
    ({ unknown = false } = {}) => {
      elements.panels.error.style.display = unknown ? 'block' : 'none'
      elements.panels.info.style.display = unknown ? 'none' : 'block'
    }
  )

  channelInfo.on(
    'change',
    (channel) => {
      elements.loading.style.display = channel ? 'none' : 'block'
      elements.stats.style.display = channel ? 'block' : 'none'
    }
  )

  channelInfo.on(
    'change',
    ({ followers = 0 } = {}) => {
      elements.followers.innerHTML = followers
    }
  )

  streamInfo.on(
    'change',
    ({ viewers = 0, created_at: createdAt } = {}) => {
      elements.viewers.innerHTML = viewers
      streamStartedAt = createdAt ? moment(createdAt) : undefined
      tick()
    }
  )
})()
