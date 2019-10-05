import replicants from '../replicants'
import getBadge from './getBadge'

const getCheermoteFromCurrentSets = (name: string) => getBadge(name, replicants.chat.badges.value)

export default getCheermoteFromCurrentSets
