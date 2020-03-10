/* global nodecg, NodeCG */

;(async () => {
  const loginURL = '/login/twitch'
  const verifyURL = '/login/twitch/verify'

  const { timeBetweenUpdates = 60000, requireLogin = true } = nodecg.bundleConfig

  const loggedInStatus = NodeCG.Replicant('login.status', 'nodecg-twitchie')

  await NodeCG.waitForReplicants(loggedInStatus)

  const redirectToLogin = () => {
    window.top.location.replace(loginURL)
  }

  // if a logged in user returns to the dashboard, it won't
  // trigger nodecg's "login" express event to be emitted
  // manually hitting this endpoint should ensure this happens
  const verifyLogin = async () => {
    const response = await fetch(verifyURL, { method: 'GET', credentials: 'include' })

    if (!response.ok) {
      throw new Error('Login endpoint returned error', response.status)
    }

    return response.status
  }

  const pollForLoginStatus = async () => {
    try {
      await verifyLogin()
      loggedInStatus.value = true
    } catch (e) {
      loggedInStatus.value = false
    }

    setTimeout(pollForLoginStatus, timeBetweenUpdates)
  }

  pollForLoginStatus()

  loggedInStatus.on('change', isLoggedIn => {
    if (requireLogin && !isLoggedIn) {
      redirectToLogin()
    }
  })
})()
