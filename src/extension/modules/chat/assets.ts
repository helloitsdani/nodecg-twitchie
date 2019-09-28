import context from '../../context'
import guarantee from '../../utils/guarantee'

const badgesLookup = () => Promise.resolve(null)
// twitch.api.badges().then((response: any) => {
//   chat.badges.value = response
// })

const cheermotesLookup = (_: any) => Promise.resolve(null)
// twitch.api
//   .cheermotes({
//     params: { channel_id: userId },
//   })
//   .then((response: any) => {
//     chat.cheermotes.value = response.actions.reduce(
//       (cheermotes: any, cheermote: any) =>
//         Object.assign({}, cheermotes, { [cheermote.prefix.toLowerCase()]: cheermote }),
//       {}
//     )
//   })

const guaranteedBadgesLookup = guarantee(badgesLookup, { timeBetweenRetries: context.config.timeBetweenRetries })

const guaranteedCheermotesLookup = guarantee(cheermotesLookup, {
  timeBetweenRetries: context.config.timeBetweenRetries,
})

context.replicants.user.id.on('change', (newVal: any) => {
  if (!newVal) {
    return
  }

  guaranteedBadgesLookup()
  guaranteedCheermotesLookup(newVal)
})
