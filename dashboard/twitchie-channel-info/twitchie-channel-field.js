import { PolymerElement, html } from '/node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-input/paper-input.js'
import '/node_modules/@polymer/iron-image/iron-image.js'

import '/bundles/nodecg-twitchie/dashboard/twitchie-styles/twitchie-styles.js'

const channelInfo = NodeCG.Replicant('channel.id', 'nodecg-twitchie')
const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')

class TwitchieChannelField extends PolymerElement {
  static get template() {
    return html`
      <style include="twitchie-styles"></style>

      <style>
        .c-channel-field-group {
          align-items: flex-end;
        }

        .c-channel-logo {
          width: 3em;
          height: 3em;
          margin: 0 0 0 1em;
          background-color: #ccc;
        }
      </style>

      <div class="c-field-group c-channel-field-group">
        <paper-input class="c-flush-input" label="Channel ID" value="{{channelId}}"></paper-input>

        <nodecg-replicant-input
          class="c-flush-input"
          label="Channel ID"
          replicant-name="channel.id"
          replicant-bundle="nodecg-twitchie"
        ></nodecg-replicant-input>

        <iron-image class="c-channel-logo" src="[[channelIcon]]" sizing="contain" preload="" fade=""></iron-image>
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
        reflectToAttribute: true,
        notify: true,
        observer: '_onChannelIdUpdate',
      },
      channelIcon: {
        type: String,
      },
    }
  }

  _onChannelIdUpdate(newChannelId, oldChannelId) {
    channelInfo.value = newChannelId
  }

  async ready() {
    super.ready()
    await NodeCG.waitForReplicants(channelInfo, userInfo)

    channelInfo.on('change', channelId => {
      this.channelId = channelId
    })

    userInfo.on('change', userInfo => {
      console.log(userInfo)
      this.channelIcon = userInfo ? userInfo.profile_image_url : undefined
    })
  }
}

customElements.define(TwitchieChannelField.is, TwitchieChannelField)
