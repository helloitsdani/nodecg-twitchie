import context from '../../context'

const handleLogin = (user?: Express.User) => {
  if (!user || context.twitch.isConnected()) {
    return
  }

  const ident = user.identities[0]

  if (ident.provider_type !== 'twitch' || !ident.provider_access_token) {
    return
  }

  try {
    context.log.debug('Handling connect...')

    context.twitch.connect({
      username: user.name,
      token: ident.provider_access_token,
    })

    context.log.debug('Connected to Twitch.')
  } catch (e) {
    context.log.error('Could not connect to Twitch!', e)
  }
}

context.nodecg.on('login', (user) => {
  handleLogin(user)
})

context.nodecg.mount((res) => {
  handleLogin(res.user)
})

context.nodecg.on('logout', () => {
  context.log.debug('Handling disconnect...')
  context.twitch.disconnect()
})
