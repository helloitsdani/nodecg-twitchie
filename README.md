# 🤖💜 nodecg-twitchie

Twitchie makes it easy to get all your Twitch channel, stream, and chat information in NodeCG, so that you can get to the fun bit and start making overlays and graphics!

Out of the box, Twitchie will provide you with all of this:

* Channel info
* Stream info
* Follower notifications
* Subscriber notifications
* Cheer notifications
* Chat, via [tmi.js](https://tmijs.org/)
* Emote (and cheermote) parsing from chat messages, including channel-specific emotes

## Usage

Everything that Twitchie handles is exposed through NodeCG's replicants and bundle messages, in the `nodecg-twitchie` namespace. This means that getting stream information in your graphics is extra-simple!

```
const showSubscriber = subscriber => {
  // show notification in your graphics...
}

const updateChannelInfo = info => {
  // update now playing, uptime, etc...
}

nodecg.listenFor('channel.subscriber', 'nodecg-twitchie', showSubscriber)

const channelInfo = nodecg.Replicant('channel.info', 'nodecg-twitchie')
channelInfo.on('change', updateChannelInfo)
```

### Events and Replicants

For a full list of all the events you can subscribe to, and the data Twitchie makes available through replicants, please see the [Events and Replicants wiki page](https://github.com/helloitsdan/nodecg-twitchie/wiki/Events-and-Replicants).

### Custom requests with Twitchie

You can also use Twitchie to query the Twitch API/access the tmi.js client directly through your bundles, if you want to do something we can't handle quite yet. For instructions on how to do this, please see the [Extension API wiki page](https://github.com/helloitsdan/nodecg-twitchie/wiki/Extension-API).

## Configuring Twitchie

In order to use Twitchie, you'll need to enable Twitch logins on your NodeCG instance, as we use this authentication to connect to the Twitch API and chat. Instructions on how to do this can be found in the [NodeCG documentation](http://nodecg.com/tutorial-nodecg-configuration.html).

Please make sure you've included **user_read** and **chat_login** in your scopes!
