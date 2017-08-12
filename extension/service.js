const app = require('express')()
const login = require('../../../lib/login')

const { nodecg, log, twitch } = require('./context')

const isTwitchSession = session => (
  session.passport
  && session.passport.user
  && session.passport.user.provider === 'twitch'
)

const hasAccessDetails = session => (
  session.passport.user.username
  && session.passport.user.accessToken
)

const performConnect = (session) => {
  const { user } = session.passport

  nodecg.log.debug('Performing connect...')

  return twitch.connect({
    username: user.username,
    token: user.accessToken
  })
}

const performDisconnect = () => {
  log.debug('Performing disconnect...')
  return twitch.disconnect()
}

const handleConnect = (session) => {
  log.debug('Handling connect...')

  if (!isTwitchSession(session) || !hasAccessDetails(session)) {
    throw new Error('Invalid session data receieved')
  }

  return performConnect(session)
}

const handleDisconnect = () => {
  log.debug('Handling disconnect...')
  return performDisconnect()
}

// listen for login and logout events emitted from nodecg's login module
login.on('login', handleConnect)
login.on('logout', handleDisconnect)

// create an express subapp with a route to refresh our the backend's twitch
// info based on the user's login state
// hitting this periodically from the dashboard allows us to keep in sync
// even if the user hasn't performed a login this browser/server session
app.get(
  '/login/twitch/verify',
  (request, response) => {
    const session = request.session

    log.debug('Token refresh endpoint hit...')

    if (!twitch.isConnected()) {
      try {
        handleConnect(session)
        log.debug('Connected to Twitch.')
      } catch (e) {
        log.error('Could not connect to Twitch!', e.message)
        return response.sendStatus(401)
      }
    } else {
      log.debug('No update necessary.')
    }

    return response.sendStatus(200)
  }
)

// mount our refresh route under the main nodecg express app
nodecg.mount(app)
