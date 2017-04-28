/* global nodecg */

(() => {
  const channelId = nodecg.Replicant('channel.id', 'nodecg-twitch-service')

  const input = document.getElementById('channel.id')
  const updateButton = document.getElementById('channel.update')

  channelId.on(
    'change',
    (newVal) => { input.value = newVal }
  )

  updateButton.addEventListener(
    'click',
    () => { channelId.value = input.value }
  )
})()
