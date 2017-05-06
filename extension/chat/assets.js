const guarantee = require('../utils/guarantee')

module.exports = (nodecg, events, twitch) => {
  const {
    chat,
    user,
  } = twitch.replicants

  const {
    timeBetweenRetries = 30000,
  } = nodecg.bundleConfig

  const badgesLookup = () =>
    twitch.api.badges()
      .then((badges) => { chat.badges.value = badges })

  const cheermotesLookup = userId =>
    twitch.api.cheermotes({
      params: { channel_id: userId }
    })
      .then((cheermotes) => { chat.cheermotes.value = cheermotes })

  const guaranteedBadgesLookup = guarantee(
    badgesLookup,
    { timeBetweenRetries, logger: nodecg.log }
  )

  const guaranteedCheermotesLookup = guarantee(
    cheermotesLookup,
    { timeBetweenRetries, logger: nodecg.log }
  )

  user.id.on('change', (newVal) => {
    if (!newVal) {
      return
    }

    guaranteedBadgesLookup()
    guaranteedCheermotesLookup(newVal)
  })
}
