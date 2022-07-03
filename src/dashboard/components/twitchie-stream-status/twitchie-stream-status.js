/* global NodeCG */

import * as Polymer from '@polymer/polymer'
import '@polymer/iron-image/iron-image'
import '@polymer/paper-input/paper-input'

import '../twitchie-style/twitchie-style'

const streamStatus = NodeCG.Replicant('stream.status', 'nodecg-twitchie')

class TwitchieStreamStatus extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <div class="c-field-group">
      <paper-input label="Stream status" value="{{streamStatus}}"></paper-input>
    </div>
`
  }

  static get is() {
    return 'twitchie-stream-status'
  }

  static get properties() {
    return {
      streamStatus: {
        type: String,
      },
    }
  }

  _onStreamStatusUpdate(newStreamStatus) {
    streamStatus.value = newStreamStatus
  }

  ready() {
    super.ready()

    NodeCG.waitForReplicants(streamStatus).then(() => {
      streamStatus.on('change', (newId) => {
        this.streamStatus = newId
      })

      this._createPropertyObserver('channelId', this._onStreamStatusUpdate)
    })
  }
}

customElements.define(TwitchieStreamStatus.is, TwitchieStreamStatus)
