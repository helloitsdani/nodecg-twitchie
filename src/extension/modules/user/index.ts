import debounce from 'debounce'
import NodeCache from 'node-cache'

import context from '../../context'
import guarantee from '../../utils/guarantee'

const cache = new NodeCache()

let pendingLookupHandle: () => void

const fetchUserId = async (username: string): Promise<string> => {
  if (!context.twitch.api) {
    throw new Error('Twitch API unavailable')
  }

  context.log.debug(`Looking up ${username} from API...`)
  const user = await context.twitch.api.users.getUserByName(username)

  if (!user) {
    throw new Error(`No user found called ${username}`)
  }

  return user.id
}

const fetchUserIdWithCache = async (username: string): Promise<string> => {
  const cachedUserId = cache.get<string>(username)

  if (cachedUserId) {
    context.log.debug(`${username} found in cache`)
    return cachedUserId
  }

  const userId = await fetchUserId(username)

  cache.set<string>(username, userId)
  return userId
}

const updateUserId = async (username: string) => {
  try {
    const userId = await fetchUserIdWithCache(username)
    context.replicants.user.id.value = userId
  } catch (e) {
    context.replicants.user.id.value = undefined
  }
}

const guaranteedUpdateUserId = guarantee(updateUserId, { timeBetweenRetries: 10000 })

context.replicants.channel.id.on(
  'change',
  debounce((username?: string) => {
    context.replicants.user.id.value = undefined

    if (!username) {
      return
    }

    if (pendingLookupHandle) {
      pendingLookupHandle()
    }

    pendingLookupHandle = guaranteedUpdateUserId(username)
  }, 1000),
)
