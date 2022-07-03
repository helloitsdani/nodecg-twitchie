/* global NodeCG */

import * as Polymer from '@polymer/polymer'

import '../twitchie-style/twitchie-style'
import '../twitchie-duration-counter/twitchie-duration-counter'

const userInfo = NodeCG.Replicant('user.info', 'nodecg-twitchie')
const streamInfo = NodeCG.Replicant('stream.info', 'nodecg-twitchie')

class TwitchieChannelStats extends Polymer.PolymerElement {
  static get template() {
    return Polymer.html`
    <style include="twitchie-style">
      .c-stats {
        display: flex;
        flex-flow: row wrap;
      }

      .c-stat {
        width: 50%;
      }

      .c-stat--full {
        width: 100%;
      }

      .c-stat__icon {
        display: inline-block;
        vertical-align: -3px;
      }
    </style>

    <div class="c-stats c-field-group">
      <div class="viewers c-stat">
        <svg class="c-stat__icon" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px">
          <path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path>
        </svg>

        {{viewers}}
      </div>

      <div class="followers c-stat">
        <svg class="c-stat__icon" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px">
          <path d="M8,13.5L1.5,7V4l2-2h3L8,3.5L9.5,2h3l2,2v3L8,13.5z"></path>
        </svg>

        {{followers}}
      </div>

      <div class="timer c-stat c-stat--full">
        <svg class="c-stat__icon" height="18px" version="1.1" viewBox="0 0 18 18" width="18px" x="0px" y="0px">
          <path clip-rule="evenodd" d="M15,14l-4-4v4H8.707l-0.5-0.5h-1L7.5,13.207V8.5h-5v4.707L2.793,13.5h-1l-0.5,0.5H1V4h10v4l4-4h2v10H15z M3,14h1l-1-1V9h1h2h1v4l-1,1h1h1l1,1v2H1v-2l1-1H3z" fill-rule="evenodd"></path>
        </svg>

        <twitchie-duration-counter started="[[streamStartedAt]]"></twitchie-duration-counter>
      </div>
    </div>
`
  }

  static get is() {
    return 'twitchie-channel-stats'
  }

  static get properties() {
    return {
      viewers: {
        type: Number,
        value: 0,
      },
      followers: {
        type: Number,
        value: 0,
      },
      streamStartedAt: {
        type: Number,
      },
    }
  }

  ready() {
    super.ready()

    NodeCG.waitForReplicants(streamInfo, userInfo).then(() => {
      userInfo.on('change', ({ followers = 0 } = {}) => {
        this.followers = followers
      })

      streamInfo.on('change', (newStreamInfo) => {
        this.viewers = newStreamInfo ? newStreamInfo.viewer_count : 0
        this.streamStartedAt = newStreamInfo ? newStreamInfo.started_at : undefined
      })
    })
  }
}

customElements.define(TwitchieChannelStats.is, TwitchieChannelStats)
