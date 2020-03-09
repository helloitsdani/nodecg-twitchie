import { PolymerElement, html } from '/node_modules/@polymer/polymer/polymer-element.js'

import './twitchie-channel-field.js'
import './twitchie-channel-status.js'

import '/bundles/nodecg-twitchie/dashboard/twitchie-styles/twitchie-styles.js'

const channelInfo = NodeCG.Replicant('stream.info', 'nodecg-twitchie')
const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

class TwitchieChannelInfo extends PolymerElement {
  static get template() {
    return html`
      <style include="twitchie-styles"></style>

      <twitchie-channel-field></twitchie-channel-field>

      <iron-pages id="pages" selected="status" attr-for-selected="name">
        <section name="error">
          We couldn't find any channels with that ID on Twitch.
        </section>

        <section name="status">
          <div id="loading" class="c-loading">
            <div class="c-loading__message">
              <paper-spinner class="c-loading__spinner" active=""></paper-spinner>
              <span>Retrieving channel info…</span>
            </div>
          </div>

          <twitchie-channel-status></twitchie-channel-status>
        </section>
      </iron-pages>
    `
  }

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
