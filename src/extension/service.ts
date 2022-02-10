import express from 'express'
import context from './context'

// this gets imported from NodeCG at runtime
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/extensions
const login = require('../../../lib/login')

const app = express()

const { log, twitch } = context

const isTwitchSession = (session: any) =>
  session.passport && session.passport.user && session.passport.user.provider === 'twitch'

const hasAccessDetails = (session: any) => session.passport.user.username && session.passport.user.accessToken

const performConnect = (session: any) => {
  const { user } = session.passport

  log.debug('Performing connect...')

  return twitch.connect({
    username: user.username,
    token: user.accessToken,
  })
}

const performDisconnect = () => {
  log.debug('Performing disconnect...')
  return twitch.disconnect()
}

const handleConnect = (session: any) => {
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
app.get('/login/twitch/verify', (request: any, response: any) => {
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
})

module.exports = app
