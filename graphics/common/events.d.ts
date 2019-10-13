/// <reference types="node" />
import EventEmitter from 'events';
import { TwitchieEmitFunction } from '../types';
declare type TwitchieEventEmitter = EventEmitter & {
    emitMessage: TwitchieEmitFunction;
};
export { TwitchieEventEmitter };
declare const _default: (nodecg: any) => TwitchieEventEmitter;
export default _default;
