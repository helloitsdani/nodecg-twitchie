/* global NodeCG, moment */

(async () => {
  const channelInfo = NodeCG.Replicant('channel.info', 'nodecg-twitchie')
  const streamInfo = NodeCG.Replicant('stream.info', 'nodecg-twitchie')
  const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

  let streamStartedAt

  const pages = document.getElementById('channel.pages')

  const elements = {
    loading: document.getElementById('loading'),
    logo: document.getElementById('logo'),
    viewers: document.getElementById('stat.viewers'),
    followers: document.getElementById('stat.followers'),
    timer: document.getElementById('stat.timer'),
  }

  await NodeCG.waitForReplicants(channelInfo, streamInfo, userInfo)

  const tick = () => {
    let timerText

    if (streamStartedAt) {
      const diff = moment.utc().diff(streamStartedAt)
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
      pages.selected = unknown
        ? 'channel.error'
        : 'channel.status'

      elements.logo.src = logo
    }
  )

  channelInfo.on(
    'change',
    (channel) => {
      elements.loading.classList.toggle('is-loading', !channel)
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

      streamStartedAt = createdAt
        ? moment(createdAt)
        : undefined

      tick()
    }
  )
})()
