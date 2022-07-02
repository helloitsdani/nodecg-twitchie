/* global NodeCG */

import * as Polymer from '@polymer/polymer'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'

import '../twitchie-style/twitchie-style'

class TwitchieEventsDebugger extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style include="twitchie-style"></style>

    <div class="c-field-group">
      <paper-dropdown-menu id="eventType" label="Event type">
        <paper-listbox slot="dropdown-content" class="dropdown-content" attr-or-property-name="value" selected="0">
          <paper-item value="debug.user.follower">Follower</paper-item>
          <paper-item value="debug.user.subscription">Subscription</paper-item>
          <paper-item value="debug.user.subscription.gift">Subscription - Single Gift</paper-item>
          <paper-item value="debug.user.subscription.community">Subscription - Community Gift</paper-item>
        </paper-listbox>
      </paper-dropdown-menu>
    </div>

    <div class="c-field-group">
      <paper-input class="c-field-group__field c-flush-input" label="Originating user" value="{{username}}"></paper-input>
    </div>

    <paper-button raised="" on-tap="sendDebugMessage">
      Send
    </paper-button>
    `
  }

  static get is() {
    return 'twitchie-events-debugger'
  }

  static get properties() {
    return {
      messageType: {
        type: String,
        value: '',
      },
      username: {
        type: String,
        value: 'pipopixie',
      },
    }
  }

  ready() {
    super.ready()
    this.$.eventType.addEventListener('selected-item-changed', (e) => {
      this._eventTypeOption(e)
    })
  }

  _eventTypeOption(e) {
    const value = e.target.selectedItem

    if (value) {
      this.messageType = value.attributes.value.value
    }
  }

  sendDebugMessage() {
    NodeCG.sendMessageToBundle(this.messageType, 'nodecg-twitchie', {
      username: this.username,
    })
  }
}

customElements.define(TwitchieEventsDebugger.is, TwitchieEventsDebugger)
