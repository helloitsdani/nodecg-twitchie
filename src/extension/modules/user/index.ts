import context from '../../context'
import guarantee from '../../utils/guarantee'

let pendingLookupHandle: () => void

const lookUpUser = async (username: string) => {
  context.log.info(`Looking up user info for ${username}...`)

  if (!context.twitch.api) {
    throw new Error('API not available')
  }

  const user = await context.twitch.api.helix.users.getUserByName(username)

  if (!user) {
    return
  }

  context.replicants.user.id.value = user.id
}

const guaranteedLookUpUser = guarantee(lookUpUser, { timeBetweenRetries: 10000 })

context.replicants.channel.id.on('change', async username => {
  context.replicants.user.id.value = undefined
  context.replicants.user.info.value = undefined

  if (pendingLookupHandle) {
    pendingLookupHandle()
  }

  pendingLookupHandle = guaranteedLookUpUser(username)
})
