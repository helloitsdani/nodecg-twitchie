/* global NodeCG */

import * as Polymer from '@polymer/polymer'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-spinner/paper-spinner'

import './twitchie-channel-field'
import './twitchie-channel-status'

import '../twitchie-style/twitchie-style'

const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

class TwitchieChannelInfo extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style include="twitchie-style"></style>

    <twitchie-channel-field></twitchie-channel-field>

    <iron-pages
      id="pages"
      selected="status"
      attr-for-selected="name"
    >
      <section name="error">
        We couldn't find any channels with that ID on Twitch.
      </section>

      <section name="status">
        <div id="loading" class="c-loading">
          <div class="c-loading__message">
            <paper-spinner class="c-loading__spinner" active></paper-spinner>
            <span>Retrieving channel info&hellip;</span>
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

  ready() {
    super.ready()

    NodeCG.waitForReplicants(userInfo).then(() => {
      userInfo.on('change', newUserInfo => {
        this.$.loading.classList.toggle('is-loading', !newUserInfo)

        if (newUserInfo) {
          // this.$.pages.selected = unknown ? 'error' : 'status'
        }
      })
    })
  }
}

customElements.define(TwitchieChannelInfo.is, TwitchieChannelInfo)
