const debounce = require('debounce')
const twitchAPI = require('./twitch-api')
const identifiedRequestModule = require('./identified-request')

module.exports = (nodecg, events, twitch) => {
  const {
    channel,
    user,
  } = twitch.replicants

  const {
    resolveChannelID,
    createIdentifiedApiRequest,
  } = identifiedRequestModule(nodecg, events, twitch)

  // this is debounced because the dashboard will update the value
  // of the channel.id replicant on every change; we only want to resolve
  // a channel id when the user's finished typing it
  const debouncedResolveChannelId = debounce(resolveChannelID, 1000)

  channel.id.on('change', (newChannelId) => {
    // clearing the resolved user information indicates a request is
    // currently ongoing
    user.id.value = undefined
    user.info.value = undefined

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
