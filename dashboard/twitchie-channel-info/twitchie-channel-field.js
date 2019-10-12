/* global nodecg, NodeCG, moment, Polymer */

;(() => {
  const channelInfo = NodeCG.Replicant('channel.info', 'nodecg-twitchie')
  const streamInfo = NodeCG.Replicant('stream.info', 'nodecg-twitchie')
  const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

  class TwitchieChannelField extends Polymer.Element {
    static get is() {
      return 'twitchie-channel-field'
    }

    static get properties() {
      return {
        channelIcon: {
          type: String,
        },
      }
    }

    async ready() {
      super.ready()
      await NodeCG.waitForReplicants(channelInfo, streamInfo, userInfo)

      userInfo.on('change', userInfo => {
        this.channelIcon = userInfo ? userInfo.profile_image_url : undefined
      })
    }
  }

  customElements.define(TwitchieChannelField.is, TwitchieChannelField)
})()
