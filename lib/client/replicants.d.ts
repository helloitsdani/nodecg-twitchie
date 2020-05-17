import { ReplicantOptionsBag } from '../common/replicants';
declare const replicants: import("..").TwitchieReplicants;
declare const createLocalReplicant: <T>(name: string, options?: ReplicantOptionsBag<T> | undefined) => import("..").Replicant<T>;
export { createLocalReplicant as createReplicant };
export default replicants;
