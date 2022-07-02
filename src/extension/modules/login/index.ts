import context from '../../context'

// this gets imported from NodeCG at runtime
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/extensions
const login = require('../../../../../lib/login')
const verifyLoginApp = context.nodecg.Router()

const isTwitchSession = (session: any) =>
  session.passport && session.passport.user && session.passport.user.provider === 'twitch'

const hasAccessDetails = (session: any) => session.passport.user.username && session.passport.user.accessToken

const handleConnect = (session: any) => {
  context.log.debug('Handling connect...')

  if (!isTwitchSession(session) || !hasAccessDetails(session)) {
    throw new Error('Invalid session data receieved')
  }

  const { user } = session.passport

  return context.twitch.connect({
    username: user.username,
    token: user.accessToken,
  })
}

const handleDisconnect = () => {
  context.log.debug('Handling disconnect...')
  return context.twitch.disconnect()
}

// listen for login and logout events emitted from nodecg's login module
login.on('login', handleConnect)
login.on('logout', handleDisconnect)

// create an express app with a route to refresh our the backend's twitch
// info based on the user's login state
// hitting this periodically from the dashboard allows us to keep in sync
// even if the user hasn't performed a login this browser/server session
verifyLoginApp.get('/login/twitch/verify', (request: any, response: any) => {
  const session = request.session

  context.log.debug('Token refresh endpoint hit...')

  if (!context.twitch.isConnected()) {
    try {
      handleConnect(session)
      context.log.debug('Connected to Twitch.')
    } catch (e) {
      context.log.error('Could not connect to Twitch!', e)
      return response.sendStatus(401)
    }
  } else {
    context.log.debug('No update necessary.')
  }

  return response.sendStatus(200)
})

context.nodecg.mount(verifyLoginApp)
