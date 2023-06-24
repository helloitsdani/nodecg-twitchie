import context from '../../context'

const handleConnect = (username: string, token: string) => {
  context.log.debug('Handling connect...')

  return context.twitch.connect({
    username,
    token,
  })
}

const handleDisconnect = () => {
  context.log.debug('Handling disconnect...')
  return context.twitch.disconnect()
}

/* we can't use the nodecg login event here as we need the user's oauth access token */
context.nodecg.mount((req) => {
  if (!req.user || context.twitch.isConnected()) {
    return
  }

  const ident = req.user.identities[0]

  if (ident.provider_type !== 'twitch' || !ident.provider_access_token) {
    return
  }

  try {
    handleConnect(req.user.name, ident.provider_access_token)
    context.log.debug('Connected to Twitch.')
  } catch (e) {
    context.log.error('Could not connect to Twitch!', e)
  }
})

context.nodecg.on('logout', () => {
  handleDisconnect()
})
