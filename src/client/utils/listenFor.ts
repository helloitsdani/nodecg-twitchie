/* global nodecg */

import { NAMESPACE } from '../../common/constants'
import { TwitchieListenFunction } from '../../types'

const listenFor: TwitchieListenFunction = (name, handler) => nodecg.listenFor(name, NAMESPACE, handler)

export default listenFor
