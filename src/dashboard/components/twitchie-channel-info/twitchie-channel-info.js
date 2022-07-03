/* global NodeCG */

import * as Polymer from '@polymer/polymer'
import '@polymer/iron-pages/iron-pages'
import '@polymer/paper-spinner/paper-spinner'

import './twitchie-channel-field'
import './twitchie-channel-stats'
import './twitchie-game-info'

import '../twitchie-style/twitchie-style'

const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

class TwitchieChannelInfo extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style include="twitchie-style">
      .c-status { position: relative; }
    </style>

    <twitchie-channel-field></twitchie-channel-field>

    <section class="c-status" name="status">
      <div id="loading" class="c-loading">
        <div class="c-loading__message">
          <paper-spinner class="c-loading__spinner" active></paper-spinner>
          <span>Retrieving channel info&hellip;</span>
        </div>
      </div>

      <twitchie-channel-stats></twitchie-channel-stats>

      <hr class="c-field-group" />

      <twitchie-game-info></twitchie-game-info>
    </section>
    `
  }

  static get is() {
    return 'twitchie-channel-info'
  }

  ready() {
    super.ready()

    NodeCG.waitForReplicants(userInfo).then(() => {
      userInfo.on('change', (newUserInfo) => {
        this.$.loading.classList.toggle('is-loading', !newUserInfo)
      })
    })
  }
}

customElements.define(TwitchieChannelInfo.is, TwitchieChannelInfo)
