/*global nodecg*/

(function () {
  const input = document.getElementById('channel.twitter')
  const updateButton = document.getElementById('channel.update')

  const twitter = nodecg.Replicant('channel.twitter')

  twitter.on(
    'change',
    newVal => input.value = newVal
  )

  updateButton.addEventListener(
    'click',
    () => {
      if (input.value) {
        twitter.value = input.value
      } else {
        input.value = twitter.value
      }
    }
  )
})()
