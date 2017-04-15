module.exports = (nodecg, twitch) => {
  twitch.client.on(
    'hosted',
    (channel, host, viewers) => nodecg.sendMessage('channel.hosted', { host, viewers })
  )

  twitch.client.on(
    'subscribe',
    (channel, username, method) => nodecg.sendMessage('channel.subscribe', { username, method })
  )

  twitch.client.on(
    'resub',
    (channel, username, months, message) => nodecg.sendMessage('channel.resub', { username, months, message })
  )
}
