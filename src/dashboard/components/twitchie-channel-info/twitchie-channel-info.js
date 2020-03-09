/* global nodecg, NodeCG, moment, Polymer */

const channelInfo = NodeCG.Replicant('stream.info', 'nodecg-twitchie')
const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

class TwitchieChannelInfo extends Polymer.Element {
  static get is() {
    return 'twitchie-channel-info'
  }

  async ready() {
    super.ready()
    await NodeCG.waitForReplicants(channelInfo, userInfo)

    userInfo.on('change', userInfo => {
      this.$.loading.classList.toggle('is-loading', !userInfo)

      if (userInfo) {
        // this.$.pages.selected = unknown ? 'error' : 'status'
      }
    })
  }
}

customElements.define(TwitchieChannelInfo.is, TwitchieChannelInfo)
