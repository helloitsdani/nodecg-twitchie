/* global nodecg */

(() => {
  const loginURL = '/login/twitch'
  const verifyURL = '/login/twitch/verify'

  const {
    timeBetweenUpdates = 60000,
    requireLogin = true,
  } = nodecg.bundleConfig

  const loggedInStatus = nodecg.Replicant('login.status', 'nodecg-twitchie')

  const redirectToLogin = () => {
    window.top.location.replace(loginURL)
  }

  // if a logged in user returns to the dashboard, it won't
  // trigger nodecg's "login" express event to be emitted
  // manually hitting this endpoint should ensure this happens
  const verifyLogin = () => (
    fetch(
      verifyURL,
      { method: 'GET', credentials: 'include' }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login endpoint returned error', response.status)
        }

        return response.status
      })
  )

  const pollForLoginStatus = () => verifyLogin()
    .then(() => {
      loggedInStatus.value = true
    })
    .catch(() => {
      loggedInStatus.value = false
    })
    .then(() => {
      setTimeout(pollForLoginStatus, timeBetweenUpdates)
    })

  pollForLoginStatus()

  loggedInStatus.on('change', (isLoggedIn) => {
    if (requireLogin && !isLoggedIn) {
      redirectToLogin()
    }
  })
})()
