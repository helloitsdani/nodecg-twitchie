"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("../common/events"));
const replicants_1 = __importDefault(require("../common/replicants"));
let nodecgInstance;
let replicants;
let events;
let twitchInstance;
const getDefaultClientID = (nodecg) => nodecg.config.login.twitch.clientID;
class TwitchieContext {
    get nodecg() {
        return nodecgInstance;
    }
    set nodecg(instance) {
        nodecgInstance = instance;
        replicants = replicants_1.default(nodecgInstance);
        events = events_1.default(nodecgInstance);
    }
    get config() {
        return Object.assign({}, { clientID: getDefaultClientID(nodecgInstance) }, nodecgInstance.bundleConfig);
    }
    set config(_) {
        throw new Error('bundleConfig is read from /cfg/nodecg-twitchie.json when NodeCG starts');
    }
    get log() {
        return nodecgInstance ? nodecgInstance.log : console;
    }
    set log(_) {
        throw new Error('Logger is created by NodeCG and cannot be overwritten');
    }
    get events() {
        return events;
    }
    set events(_) {
        throw new Error('Emitter is initialised when nodecg instance is set');
    }
    get replicants() {
        return replicants;
    }
    set replicants(_) {
        throw new Error('Replicants are initialised when nodecg instance is set');
    }
    get twitch() {
        return twitchInstance;
    }
    set twitch(instance) {
        twitchInstance = instance;
    }
}
const context = new TwitchieContext();
exports.default = context;
//# sourceMappingURL=context.js.map