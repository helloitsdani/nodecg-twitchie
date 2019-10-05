import replicants, { createReplicant } from '../common/replicants'

import getBadge from './utils/getBadge'
import getBadgeFromCurrentSets from './utils/getBadgeFromCurrentSets'
import getEmote from './utils/getEmote'
import listenFor from './utils/listenFor'

export { createReplicant, listenFor, getEmote, getBadge, getBadgeFromCurrentSets }

export default {
  ...replicants,
  on: listenFor,
}
