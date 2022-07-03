/* global NodeCG */

import * as Polymer from '@polymer/polymer'
import '@polymer/iron-image/iron-image'
import '@polymer/paper-input/paper-input'

import '../twitchie-style/twitchie-style'

const channelId = NodeCG.Replicant('channel.id', 'nodecg-twitchie')
const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

class TwitchieChannelField extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style include="twitchie-style">
      .c-channel-field-group {
        align-items: flex-start;
      }

      .c-channel-logo {
        flex-shrink: 0;
        width: 3em;
        height: 3em;
        margin: 0 1em 0 0;
        background-color: #ccc;
      }
    </style>

    <div class="c-field-group c-channel-field-group">
      <iron-image class="c-channel-logo" src="[[channelIcon]]" sizing="contain" preload="" fade=""></iron-image>
      <paper-input class="c-flush-input" label="Channel ID" value="{{channelId}}"></paper-input>
    </div>
`
  }

  static get is() {
    return 'twitchie-channel-field'
  }

  static get properties() {
    return {
      channelId: {
        type: String,
      },
      channelIcon: {
        type: String,
      },
    }
  }

  _onChannelIdUpdate(newChannelId) {
    channelId.value = newChannelId
  }

  ready() {
    super.ready()

    NodeCG.waitForReplicants(channelId, userInfo).then(() => {
      channelId.on('change', (newId) => {
        this.channelId = newId
      })

      userInfo.on('change', (newUserInfo) => {
        this.channelIcon = newUserInfo ? newUserInfo.profile_image_url : undefined
      })

      this._createPropertyObserver('channelId', this._onChannelIdUpdate)
    })
  }
}

customElements.define(TwitchieChannelField.is, TwitchieChannelField)
