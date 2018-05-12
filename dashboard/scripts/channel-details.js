/* global nodecg, moment */

(async () => {
  const channelInfo = nodecg.Replicant('channel.info', 'nodecg-twitchie')
  const streamInfo = nodecg.Replicant('stream.info', 'nodecg-twitchie')
  const userInfo = nodecg.Replicant('user.info', 'nodecg-twitchie')

  await NodeCG.waitForReplicants(channelInfo, streamInfo, userInfo)

  let streamStartedAt

  const elements = {
    pages: {
      error: document.getElementById('error-page'),
      info: document.getElementById('info-page'),
    },

    logo: document.getElementById('logo'),
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer'),
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

  userInfo.on(
    'change',
    ({ unknown = false, logo } = {}) => {
      elements.pages.error.style.display = unknown ? 'block' : 'none'
      elements.pages.info.style.display = unknown ? 'none' : 'block'

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
