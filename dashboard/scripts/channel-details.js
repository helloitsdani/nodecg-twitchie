/* global nodecg, moment */

(() => {
  const channelInfo = nodecg.Replicant('channel.info', 'nodecg-twitch-service')
  const streamInfo = nodecg.Replicant('stream.info', 'nodecg-twitch-service')
  const loggedInStatus = nodecg.Replicant('login.status', 'nodecg-twitch-service')
  const userInfo = nodecg.Replicant('user.info', 'nodecg-twitch-service')

  let streamStartedAt

  const elements = {
    pages: {
      login: document.getElementById('login-pages'),
      stats: document.getElementById('stats-pages'),
      info: document.getElementById('info-page'),
    },

    logo: document.getElementById('logo'),
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer'),
  }

  loggedInStatus.on(
    'change',
    (isLoggedIn) => {
      elements.pages.login.selected = isLoggedIn ? 'channel' : 'login'
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
    ({ unknown = false, logo } = {}) => {
      elements.pages.stats.selected = unknown ? 'error' : 'info'
      elements.logo.src = logo
    }
  )

  channelInfo.on(
    'change',
    (channel) => {
      elements.pages.info.classList.toggle('is-loading', !channel)
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
