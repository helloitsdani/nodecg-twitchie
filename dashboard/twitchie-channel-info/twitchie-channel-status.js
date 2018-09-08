/* global nodecg, NodeCG, moment, Polymer */

(() => {
  const channelInfo = NodeCG.Replicant('channel.info', 'nodecg-twitchie')
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
      await NodeCG.waitForReplicants(channelInfo, streamInfo)

      channelInfo.on(
        'change',
        ({ followers = 0 } = {}) => {
          this.followers = followers
        }
      )

      streamInfo.on(
        'change',
        ({ viewers = 0, created_at: createdAt } = {}) => {
          this.viewers = viewers
          this.streamStartedAt = createdAt
        }
      )
    }
  }

  customElements.define(TwitchieChannelStatus.is, TwitchieChannelStatus)
})()
