import { Replicant, TwitchieReplicants } from '../types';
interface ReplicantOptionsBag<T> {
    defaultValue?: T;
    persistent?: boolean;
}
declare const createReplicant: <T>(nodecg: any, name: string, { defaultValue, persistent }?: ReplicantOptionsBag<T>) => Replicant<T>;
export { ReplicantOptionsBag, createReplicant };
declare const _default: (nodecg: any, defaults?: any) => TwitchieReplicants;
export default _default;
