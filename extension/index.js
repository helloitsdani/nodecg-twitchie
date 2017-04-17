const app = require('express')()
const login = require('../../../lib/login')

const isNodeCGConfigValid = config => (
  config.login.enabled
  && config.login.twitch.enabled
)

const isClientIDPresent = config => config.clientID !== undefined

const isTwitchSession = session => (
  session.passport
  && session.passport.user
  && session.passport.user.provider === 'twitch'
)

const hasAccessDetails = session => (
  session.passport.user.username
  && session.passport.user.accessToken
)

module.exports = (nodecg) => {
  if (!isNodeCGConfigValid(nodecg.config)) {
    throw new Error('nodecg-twitch-service requires Twitch login to be enabled in your NodeCG config!')
  }

  if (!isClientIDPresent(nodecg.bundleConfig)) {
    throw new Error('nodecg-twitch-service needs to have a Twitch API Client ID to run properly. Please generate one at https://www.twitch.tv/kraken/oauth2/clients/new')
  }

  let twitch

  const performConnect = (session) => {
    const { user } = session.passport

    // twitch currently doesn't expire oauth tokens
    // therefore i'm going to naively assume that once
    // we've logged in and connected, it should be okay
    // for the lifespan of the server/stream
    twitch = require('./twitch')(nodecg, {
      username: user.username,
      token: user.accessToken
    })

    twitch.connect()
      .then(() => {
        require('./chat')(nodecg, twitch)
        require('./channel-info')(nodecg, twitch)
      })
  }

  const performDisconnect = () => {
    twitch.disconnect()
      .then(() => {
        twitch = undefined
      })
      .catch(() => {
        twitch = undefined
      })
  }

  const handleConnect = (session) => {
    if (!isTwitchSession(session) || !hasAccessDetails(session)) {
      throw new Error('Invalid session data receieved')
    }

    if (twitch) {
      performDisconnect()
    }

    performConnect(session)
  }

  const handleDisconnect = () => {
    if (!twitch) {
      return
    }

    performDisconnect()
  }


  // listen for login and logout events emitted from nodecg's login module
  login.on('login', handleConnect)
  login.on('logout', handleDisconnect)

  // create an express subapp with a route to refresh our the backend's twitch
  // info based on the user's login stateh
  // hitting this periodically from the dashboard allows us to keep in sync
  // even if the user hasn't performed a login this browser/server session
  app.get(
    '/login/twitch/verify',
    (request, response) => {
      const session = request.session

      nodecg.log.debug('Token refresh endpoint hit...')

      if (!twitch) {
        try {
          handleConnect(session)
          nodecg.log.debug('Connected to Twitch.')
        } catch (e) {
          nodecg.log.error('Could not connect to Twitch!', e)
          return response.sendStatus(500)
        }
      } else {
        nodecg.log.debug('No update necessary.')
      }

      return response.sendStatus(200)
    }
  )

  // mount our refresh route under the main nodecg express app
  nodecg.mount(app)

  // exposes a reference to the current twitch client for other modules to consume
  return {
    twitch,
  }
}
