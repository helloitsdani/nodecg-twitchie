import replicants, { createReplicant } from './replicants'
import { TwitchieListenFunction, TwitchieReplicants } from '../types'

import getBadge from './utils/getBadge'
import getBadgeFromCurrentSets from './utils/getBadgeFromCurrentSets'
import getEmote from './utils/getEmote'
import listenFor from './utils/listenFor'

export { createReplicant, listenFor, getEmote, getBadge, getBadgeFromCurrentSets }

type TwitchieClient = TwitchieReplicants & {
  on: TwitchieListenFunction
}

const client: TwitchieClient = {
  ...replicants,
  on: listenFor,
}

export { TwitchieClient }
export default client
