/* global nodecg, NodeCG, moment, Polymer */

(() => {
  const channelInfo = NodeCG.Replicant('channel.info', 'nodecg-twitchie')
  const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

  class TwitchieChannelInfo extends Polymer.Element {
    static get is() {
      return 'twitchie-channel-info'
    }

    async ready() {
      super.ready()
      await NodeCG.waitForReplicants(channelInfo, userInfo)

      channelInfo.on(
        'change',
        (channel) => {
          this.$.loading.classList.toggle('is-loading', !channel)
        }
      )

      userInfo.on(
        'change',
        ({ unknown = false } = {}) => {
          this.$.pages.selected = unknown
            ? 'error'
            : 'status'
        }
      )
    }
  }

  customElements.define(TwitchieChannelInfo.is, TwitchieChannelInfo)
})()
