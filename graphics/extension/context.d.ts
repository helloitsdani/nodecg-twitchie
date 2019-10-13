import { TwitchieEventEmitter } from '../common/events';
import { TwitchieReplicants } from '../types';
import { TwitchieClientWrapper } from './client';
declare class TwitchieContext {
    nodecg: any;
    config: any;
    log: any;
    events: TwitchieEventEmitter;
    replicants: TwitchieReplicants;
    twitch: TwitchieClientWrapper;
}
declare const context: TwitchieContext;
export default context;
