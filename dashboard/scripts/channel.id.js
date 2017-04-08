/*global nodecg*/

(function () {
  // if a logged in user returns to the dashboard, it won't
  // trigger nodecg's "login" express event to be emitted
  // manually hitting this endpoint should ensure this happens
  fetch(
    '/login/twitch/verify',
    { method: 'GET', credentials: 'include' }
  )
    .then((response) => {
      if (!response.ok) {
        window.top.location.replace("/login/twitch")
      }
    })

  const input = document.getElementById('channel.id')
  const updateButton = document.getElementById('channel.update')

  const channelId = nodecg.Replicant('channel.id')

  channelId.on('change', newVal => input.value = newVal)

  updateButton.addEventListener(
    'click',
    () => {
      if (input.value) {
        channelId.value = input.value
      } else {
        input.value = channelId.value
      }
    }
  )
})()
