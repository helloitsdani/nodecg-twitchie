const debounce = require('debounce')
const twitchAPI = require('./twitch-api')
const identifiedRequestModule = require('./identified-request')

module.exports = (nodecg, events, twitch) => {
  const {
    timeBetweenRetries = 30000,
  } = nodecg.bundleConfig

  const {
    channel,
    user,
  } = twitch.replicants

  const {
    resolveChannelId,
    createIdentifiedApiRequest,
  } = identifiedRequestModule(nodecg, events, twitch)

  let channelIdResolveTimeout

  // split out into its own function so that it can call itself
  // in order to re-run the same promise
  const resolveChannelIdWithRetry = newChannelId => (
    resolveChannelId(newChannelId)
      .catch((error) => {
        channelIdResolveTimeout = setTimeout(
          () => resolveChannelIdWithRetry(newChannelId),
          timeBetweenRetries
        )

        nodecg.log.error(`Channel ID lookup request failed! Retrying in ${timeBetweenRetries / 1000} seconds...`, error)
      })
  )

  // debounced because the dashboard will update the value
  // of the channel.id replicant on every change; we only want to resolve
  // a channel id when the user's finished typing it
  const debouncedResolveChannelId = debounce(resolveChannelIdWithRetry, 1000)

  channel.id.on('change', (newChannelId) => {
    channelIdResolveTimeout = clearTimeout(channelIdResolveTimeout)

    // clearing the resolved user information indicates a request is
    // currently ongoing
    user.id.value = undefined
    user.info.value = undefined

    if (!newChannelId) {
      return
    }

    debouncedResolveChannelId(newChannelId)
  })

  // proxy convenience methods for performing API requests;
  // rather than having to do api('channel', ...), this lets you
  // call api.channel(...)
  return new Proxy(createIdentifiedApiRequest, {
    get: (target, resource) => (
      resource in twitchAPI.resources
        ? ({ params, method } = {}) => (
          createIdentifiedApiRequest({
            resource,
            params,
            method
          })
        )
        : target[resource]
    )
  })
}
