const debounce = require('debounce')
const guarantee = require('../../utils/guarantee')

const { config, replicants } = require('../../context')
const twitchAPI = require('./twitch-api')
const { resolveChannelId, createIdentifiedApiRequest } = require('./identified-request')

const { timeBetweenRetries } = config
const { channel, user } = replicants

const guaranteedResolveChannelId = guarantee(
  resolveChannelId,
  { timeBetweenRetries }
)

// debounced because the dashboard will update the value
// of the channel.id replicant on every change; we only want to resolve
// a channel id when the user's finished typing it
const debouncedResolveChannelId = debounce(guaranteedResolveChannelId, 1000)

channel.id.on('change', (newChannelId) => {
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
module.exports = new Proxy(createIdentifiedApiRequest, {
  get: (target, resource) => (
    resource in twitchAPI.resources
      ? (params = {}) =>
        createIdentifiedApiRequest(
          Object.assign({}, params, { resource })
        )
      : target[resource]
  )
})
