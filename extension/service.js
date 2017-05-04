const app = require('express')()
const login = require('../../../lib/login')

const createTwitchEventEmitter = require('./events')
const twitchModule = require('./twitch')
const chatModule = require('./chat')
const channelModule = require('./channel')

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
  const events = createTwitchEventEmitter(nodecg)
  const twitch = twitchModule(nodecg, events)
  chatModule(nodecg, events, twitch)
  channelModule(nodecg, events, twitch)

  const performConnect = (session) => {
    const { user } = session.passport

    nodecg.log.debug('Performing connect...')

    return twitch.connect({
      username: user.username,
      token: user.accessToken
    })
  }

  const performDisconnect = () => {
    nodecg.log.debug('Performing disconnect...')
    return twitch.disconnect()
  }

  const handleConnect = (session) => {
    nodecg.log.debug('Handling connect...')

    if (!isTwitchSession(session) || !hasAccessDetails(session)) {
      throw new Error('Invalid session data receieved')
    }

    return performConnect(session)
  }

  const handleDisconnect = () => {
    nodecg.log.debug('Handling disconnect...')
    return performDisconnect()
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

      if (!twitch.isConnected()) {
        try {
          handleConnect(session)
          nodecg.log.debug('Connected to Twitch.')
        } catch (e) {
          nodecg.log.error('Could not connect to Twitch!', e.message)
          return response.sendStatus(401)
        }
      } else {
        nodecg.log.debug('No update necessary.')
      }

      return response.sendStatus(200)
    }
  )

  // mount our refresh route under the main nodecg express app
  nodecg.mount(app)

  // exposes the module's EventEmitter, and proxies requests to the current
  // twitch instance if one exists--we can't just return the twitch object,
  // because we create and destroy it based on user login status
  // this lets other nodecg bundles access the twitch api and recieve events we emit
  return new Proxy(events, {
    get: (target, method) => (
      twitch !== undefined && method in twitch
        ? twitch[method]
        : target[method]
    )
  })
}
