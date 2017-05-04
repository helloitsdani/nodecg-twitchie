const requestModule = require('./request')

// twitch api v5 requires that all api requests use user ID, rather than
// channel name, to parameterise requests
// this module resolves channel names to user IDs whenever the channel.id
// replicant is updated, and providers a wrapper to createApiRequest which
// ensures this information is available
module.exports = (nodecg, events, twitch) => {
  const {
    user,
  } = twitch.replicants
  const createApiRequest = requestModule(nodecg, events, twitch)
  let userInfoRequest = Promise.resolve()

  const userLookupRequest = newChannelId =>
    createApiRequest({
      resource: 'users',
      params: { login: newChannelId },
    })
      .then(({ users }) => {
        if (!users || users.length <= 0) {
          nodecg.log.debug(`Twitch API found no users with the channel ID "${newChannelId}"`)

          user.id.value = undefined
          user.info.value = { unknown: true }
          return undefined
        }

        // eslint-disable-next-line no-underscore-dangle
        user.id.value = users[0]._id
        user.info.value = users[0]
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
  const createIdentifiedApiRequest = params =>
    userInfoRequest
      .then(userId => createApiRequest(
        Object.assign({}, params, { userId })
      ))

  return {
    resolveChannelId,
    createIdentifiedApiRequest,
  }
}
