/* global nodecg, moment */

(() => {
  const channelInfo = nodecg.Replicant('channel.info', 'nodecg-twitch-service')
  const streamInfo = nodecg.Replicant('stream.info', 'nodecg-twitch-service')
  const loggedInStatus = nodecg.Replicant('login.status', 'nodecg-twitch-service')

  let streamStartedAt

  const elements = {
    loginMessage: document.getElementById('login-message'),
    channelInfo: document.getElementById('channel-info'),
    loading: document.getElementById('loading'),
    stats: document.getElementById('stats'),
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer'),
  }

  loggedInStatus.on(
    'change',
    (isLoggedIn) => {
      elements.loginMessage.style.display = isLoggedIn ? 'none' : 'block'
      elements.channelInfo.style.display = isLoggedIn ? 'block' : 'none'
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
    ({ viewers = 0, timer = 0 } = {}) => {
      elements.viewers.innerHTML = viewers
      streamStartedAt = timer ? moment(timer) : undefined
      tick()
    }
  )
})()
