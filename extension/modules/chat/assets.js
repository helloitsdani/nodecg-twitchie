const { replicants, config } = require('../../context')
const api = require('../../api')
const guarantee = require('../../utils/guarantee')

const { chat, user } = replicants
const { timeBetweenRetries } = config

const badgesLookup = () =>
  api.badges()
    .then((response) => { chat.badges.value = response })

const cheermotesLookup = userId =>
  api.cheermotes({
    params: { channel_id: userId }
  })
    .then((response) => {
      chat.cheermotes.value = response.actions.reduce(
        (cheermotes, cheermote) => (
          Object.assign(
            {},
            cheermotes,
            { [cheermote.prefix.toLowerCase()]: cheermote }
          )
        ), {}
      )
    })

const guaranteedBadgesLookup = guarantee(
  badgesLookup,
  { timeBetweenRetries }
)

const guaranteedCheermotesLookup = guarantee(
  cheermotesLookup,
  { timeBetweenRetries }
)

user.id.on('change', (newVal) => {
  if (!newVal) {
    return
  }

  guaranteedBadgesLookup()
  guaranteedCheermotesLookup(newVal)
})
