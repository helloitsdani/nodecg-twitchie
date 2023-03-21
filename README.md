# 🤖💜 nodecg-twitchie

Twitchie makes it easy to get all your Twitch channel, stream, and chat information in NodeCG, so that you can get to the fun bit and start making overlays and graphics!

Out of the box, Twitchie will provide you with all of this:

- User info
- Stream info
- Follower notifications
- Subscriber notifications
- Cheer notifications
- Chat and API calls through the [really good twurple libraries](https://twurple.js.org/)

## Compatibility

Twitchie requires that you use a version of NodeCG greater than _2.0.0_, and a version of node greater than _16.0.0_, because of some compatibility stuff.

## Usage

Everything that Twitchie handles is exposed through NodeCG's replicants and bundle messages, in the `nodecg-twitchie` namespace. This means that getting stream information in your graphics is extra-simple!

```javascript
const showSubscriber = (subscriber) => {
  // show notification in your graphics...
}

const updateChannelInfo = (info) => {
  // update now playing, uptime, etc...
}

nodecg.listenFor(
  'channel.subscriber',
  'nodecg-twitchie',
  showSubscriber
)

const streamInfo = nodecg.Replicant('stream.info', 'nodecg-twitchie')
streamInfo.on('change', updateStreamInfo)
```

### The twitchie client

The default export of this module is a little client for use in your graphics, which gives you an easy way to listen to events or access your stream information in your graphics without having to manually configure loads of replicants. Using the twitchie client, the above example could be rewritten like so...

```javascript
import twitchie from 'nodecg-twitchie'

twitchie.on('channel.subscriber', showSubscriber)
twitchie.stream.info.on('change', updateStreamInfo)
```

### Custom requests with Twitchie

The twitchie extension exposes an instance of the [twurple API library](https://twurple.js.org/). If you want to query the Twitch API directly, you can access it through `nodecg.extensions['nodecg-twitchie'].api`.

## Configuring Twitchie

In order to use Twitchie, you'll need to enable Twitch logins on your NodeCG instance, as we use this authentication to connect to the Twitch API and chat. Instructions on how to do this can be found in the [NodeCG documentation](https://www.nodecg.dev/docs/nodecg-configuration).

Please make sure you've included `user_read channel:read:subscriptions channel:read:redemptions user:read:broadcast moderator:read:followers bits:read chat:read chat:edit` in your scopes!
