import replicants, { createReplicant } from './replicants'
import { TwitchieClient } from '../types'

import getBadge from './utils/getBadge'
import getBadgeFromCurrentSets from './utils/getBadgeFromCurrentSets'
import getEmote from './utils/getEmote'
import listenFor from './utils/listenFor'

export { createReplicant, listenFor, getEmote, getBadge, getBadgeFromCurrentSets }

const client: TwitchieClient = {
  ...replicants,
  on: listenFor,
}

export default client
