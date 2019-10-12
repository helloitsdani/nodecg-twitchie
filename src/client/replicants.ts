import createReplicants, { createReplicant, ReplicantOptionsBag } from '../common/replicants'

const replicants = createReplicants(nodecg)

const createLocalReplicant = <T>(name: string, options?: ReplicantOptionsBag<T>) =>
  createReplicant(nodecg, name, options)

export { createLocalReplicant as createReplicant }
export default replicants
