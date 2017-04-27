/* global nodecg */

(() => {
  const input = document.getElementById('channel.id')
  const updateButton = document.getElementById('channel.update')

  const channelId = nodecg.Replicant('channel.id')

  channelId.on(
    'change',
    (newVal) => { input.value = newVal }
  )

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
