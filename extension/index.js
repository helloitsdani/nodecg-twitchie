"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const context_1 = __importDefault(require("./context"));
const isNodeCGConfigValid = (config) => config.login.enabled && config.login.twitch.enabled && config.login.twitch.clientID;
module.exports = (nodecg) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isNodeCGConfigValid(nodecg.config)) {
        throw new Error('nodecg-twitchie requires Twitch login to be enabled in your NodeCG config!');
    }
    context_1.default.nodecg = nodecg;
    context_1.default.twitch = new client_1.TwitchieClientWrapper();
    // mount our refresh route under the main nodecg express app
    const service = require('./service');
    nodecg.mount(service);
    require('./modules/user');
    require('./modules/channel');
    require('./modules/chat');
    // exposes the module's EventEmitter, and proxies requests to the current
    // twitch instance if one exists--we can't just return the twitch object,
    // because we create and destroy it based on user login status
    // this lets other nodecg bundles access the twitch api and recieve events we emit
    return new Proxy(context_1.default.events, {
        get: (target, method) => {
            if (method === 'replicants') {
                return context_1.default.replicants;
            }
            if (method === 'api') {
                return context_1.default.twitch.api;
            }
            if (method === 'client') {
                return context_1.default.twitch.client;
            }
            return target[method];
        },
    });
});
//# sourceMappingURL=index.js.map