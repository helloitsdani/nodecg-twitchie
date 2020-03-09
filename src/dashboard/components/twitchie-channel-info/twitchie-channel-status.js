/* global nodecg, NodeCG, moment, Polymer */

const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')
const streamInfo = NodeCG.Replicant('stream.info', 'nodecg-twitchie')

class TwitchieChannelStatus extends Polymer.Element {
  static get is() {
    return 'twitchie-channel-status'
  }

  static get properties() {
    return {
      viewers: {
        type: Number,
        value: 0,
      },
      followers: {
        type: Number,
        value: 0,
      },
      streamStartedAt: {
        type: Number,
      },
    }
  }

  async ready() {
    super.ready()
    await NodeCG.waitForReplicants(userInfo, streamInfo)

    userInfo.on('change', ({ followers = 0 } = {}) => {
      this.followers = followers
    })

    streamInfo.on('change', streamInfo => {
      this.viewers = streamInfo ? streamInfo.viewer_count : 0
      this.streamStartedAt = streamInfo ? streamInfo.started_at : undefined
    })
  }
}

customElements.define(TwitchieChannelStatus.is, TwitchieChannelStatus)
