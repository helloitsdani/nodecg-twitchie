/* global nodecg, NodeCG */

;(() => {
  const loginURL = '/login/twitch'
  const verifyURL = '/login/twitch/verify'

  const { timeBetweenUpdates = 60000, requireLogin = true } = nodecg.bundleConfig
  const loggedInStatus = NodeCG.Replicant('login.status', 'nodecg-twitchie', {
    defaultValue: false,
    persistent: false,
  })
  let pollTimeout

  /*
   * we need to hit the verify endpoint to make sure that
   * the Twitchie client has the user's current access token.
   * we can get this on NodeCG's login event when a user
   * explicitly logs in--but this only happens with new logins,
   * not for users who already have a session cookie
   */
  const verifyLogin = async () => {
    const response = await fetch(verifyURL)

    if (!response.ok) {
      throw new Error('Login endpoint returned error', response.status)
    }

    return response.status
  }

  const pollForLoginStatus = async () => {
    clearTimeout(pollTimeout)

    try {
      if (window.navigator.onLine) {
        await verifyLogin()
        loggedInStatus.value = true
      }

      pollTimeout = setTimeout(pollForLoginStatus, timeBetweenUpdates)
    } catch (e) {
      window.top.location.replace(loginURL)
    }
  }

  pollForLoginStatus()

  /*
   * this replicant should only change when NodeCG restarts;
   * re-polling when that happens allows us to reconnect to
   * Twitch without having to refresh the Dashboard
   */
  loggedInStatus.on('change', (isLoggedIn) => {
    if (requireLogin && !isLoggedIn) {
      pollForLoginStatus()
    }
  })
})()
