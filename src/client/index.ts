import { TwitchieClient } from '../types'
import replicants from './replicants'
import listenFor from './utils/listenFor'

const client: TwitchieClient = {
  ...replicants,
  on: listenFor,
}

export * from '../types'

export { createReplicant } from './replicants'
export { default as getEmote } from './utils/getEmote'
export { default as listenFor } from './utils/listenFor'

export default client
