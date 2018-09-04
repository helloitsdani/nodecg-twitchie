// twitch api v5 requires that all api requests use user ID, rather than
// channel name, to parameterise requests
// this module resolves channel names to user IDs whenever the channel.id
// replicant is updated, and providers a wrapper to createApiRequest which
// ensures this information is available

const createAuthorisedApiRequest = require('./authorised-request')
const { log, replicants } = require('../context')

const { user } = replicants
let userInfoRequest = Promise.resolve()

const userLookupRequest = newChannelId =>
  createAuthorisedApiRequest({
    resource: 'users',
    params: { login: newChannelId },
  })
    .then(({ users }) => {
      if (!users || users.length <= 0) {
        log.debug(`Twitch API found no users with the channel ID "${newChannelId}"`)

        user.id.value = undefined
        user.info.value = { unknown: true }
        return undefined
      }

      const resolvedUser = users[0]

      log.debug(`User ${newChannelId} resolved to ID ${resolvedUser._id}`)

      // eslint-disable-next-line no-underscore-dangle
      user.id.value = resolvedUser._id
      user.info.value = resolvedUser

      return user.id.value
    })

// performs a lookup for the specified channel ID, and ensures
// api requests performed after this point wait until this lookup
// has resolved
const resolveChannelId = (newChannelId) => {
  const performLookup = () => {
    userInfoRequest = newChannelId
      ? userLookupRequest(newChannelId)
      : Promise.reject(new Error('No User ID has been set for requests'))

    return userInfoRequest
  }

  // chain the new lookup off the old one, in order to eliminate
  // weird race conditions with long-running pending requests
  return userInfoRequest
    .then(performLookup)
    .catch(performLookup)
}

// creating API requests through this method allows you to ensure that
// the current channel name has been resolved to a twitch userId
const createIdentifiedApiRequest = (params = {}) =>
  userInfoRequest
    .then(userId => createAuthorisedApiRequest(
      Object.assign({}, params, { userId })
    ))

module.exports = {
  resolveChannelId,
  createIdentifiedApiRequest,
}
