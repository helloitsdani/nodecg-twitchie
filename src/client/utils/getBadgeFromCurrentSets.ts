import replicants from '../replicants'
import getBadge from './getBadge'

const getBadgeFromCurrentSets = (name: string) => getBadge(name, replicants.chat.badges.value)

export default getBadgeFromCurrentSets
