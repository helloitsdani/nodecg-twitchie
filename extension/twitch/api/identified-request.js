const requestModule = require('./request')

// twitch api v5 requires that all api requests use user ID, rather than
// channel name, to parameterise requests
// this module resolves channel names to user IDs whenever the channel.id
// replicant is updated, and providers a wrapper to createApiRequest which
// ensures this information is available
module.exports = (nodecg, events, twitch) => {
  const {
    timeBetweenRetries = 30000,
  } = nodecg.bundleConfig

  const {
    user,
  } = twitch.replicants

  // all API requests expect to chain off a promise resolving to a user id;
  // when there's no known id, we want to reject all authorised requests
  const undefinedUserIDRejection = Promise.reject('No User ID has been set for requests')

  let userInfoRequest = undefinedUserIDRejection
  let userInfoRequestRetryTimeout

  const createApiRequest = requestModule(nodecg, events, twitch)

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

  // resolves the corresponding channel id to a user id
  // if there is a technical problem with the request,
  // this method will wait for a specified amount of time
  // and then try again
  const fetchUserInfo = (newChannelId) => {
    if (!newChannelId) {
      userInfoRequest = undefinedUserIDRejection
      return userInfoRequest
    }

    userInfoRequest = userLookupRequest(newChannelId)
      .catch((error) => {
        userInfoRequestRetryTimeout = setTimeout(
          () => userLookupRequest(newChannelId),
          timeBetweenRetries
        )

        nodecg.log.error('User lookup request failed!', error)
        throw error
      })

    return userInfoRequest
  }

  // performs a lookup for the specified channel ID, and ensures
  // api requests performed after this point wait until this lookup
  // has resolved
  const resolveChannelID = (newChannelId) => {
    const performLookup = () => {
      userInfoRequestRetryTimeout = clearTimeout(userInfoRequestRetryTimeout)
      return fetchUserInfo(newChannelId)
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
    resolveChannelID,
    createIdentifiedApiRequest,
  }
}
