import createReplicants, { createReplicant } from '../common/replicants'

const replicants = createReplicants(nodecg)

const createLocalReplicant = <T>(name: string, defaultValue: T) => createReplicant(nodecg, name, defaultValue)

export { createLocalReplicant as crateReplicant }
export default replicants
