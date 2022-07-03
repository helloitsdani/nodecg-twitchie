/* global NodeCG */

import * as Polymer from '@polymer/polymer'
import '@polymer/iron-image/iron-image'
import '@polymer/paper-input/paper-input'

import '../twitchie-style/twitchie-style'

const gameInfo = NodeCG.Replicant('game.info', 'nodecg-twitchie')

class TwitchieGameInfo extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style include="twitchie-style">
      .c-game-info-group {
        align-items: center;
      }

      .c-game-art {
        flex-shrink: 0;
        width: 3em;
        height: 3em;
        margin: 0 1em 0 0;
        background-color: #ccc;
      }
    </style>

    <div id="game" class="c-field-group c-game-info-group">
      <iron-image class="c-game-art" src="[[gameArt]]" sizing="contain" preload="" fade=""></iron-image>

      <template is="dom-if" if="{{showGameInfo}}">
        {{gameName}}
      </template>

      <template is="dom-if" if="{{!showGameInfo}}">
        No category set
      </template>
    </div>
`
  }

  static get is() {
    return 'twitchie-game-info'
  }

  static get properties() {
    return {
      gameName: {
        type: String,
      },
      gameArt: {
        type: String,
      },
      showGameInfo: {
        type: Boolean,
        computed: '_gameInfoExists(gameName)',
        value: false,
      },
    }
  }

  _gameInfoExists(gameName) {
    return gameName !== undefined
  }

  ready() {
    super.ready()

    NodeCG.waitForReplicants(gameInfo).then(() => {
      gameInfo.on('change', (newGame) => {
        this.gameName = newGame?.name
        this.gameArt = newGame?.box_art_url.replaceAll(/{(width|height)}/g, 300)
      })
    })
  }
}

customElements.define(TwitchieGameInfo.is, TwitchieGameInfo)
