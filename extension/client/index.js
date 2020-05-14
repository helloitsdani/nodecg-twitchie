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
const twitch_1 = __importDefault(require("twitch"));
const twitch_chat_client_1 = __importDefault(require("twitch-chat-client"));
const context_1 = __importDefault(require("../context"));
const chat_handlers_1 = __importDefault(require("./chat-handlers"));
class TwitchieClientWrapper {
    constructor() {
        this.isConnected = () => !!this.client;
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.quit();
            }
            catch (e) {
                // Oh Well
            }
            this.client = undefined;
        });
        this.connect = (auth) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.auth = auth;
            context_1.default.log.debug('Connecting to twitch...');
            if (this.isConnected()) {
                yield this.disconnect();
            }
            this.api = yield twitch_1.default.withCredentials(context_1.default.config.clientID, this.auth.token, undefined);
            this.client = yield twitch_chat_client_1.default.forTwitchClient(this.api, {
                channels: () => {
                    var _a;
                    const currentChannel = context_1.default.replicants.channel.id.value || ((_a = this.auth) === null || _a === void 0 ? void 0 : _a.username);
                    return currentChannel ? [currentChannel] : [];
                },
            });
            try {
                chat_handlers_1.default(this.client);
                yield this.client.connect();
                context_1.default.replicants.channel.id.value = (_a = this.auth) === null || _a === void 0 ? void 0 : _a.username;
            }
            catch (error) {
                this.api = undefined;
                this.client = undefined;
                context_1.default.log.error('Could not connect to Twitch!', error);
                throw error;
            }
        });
    }
}
exports.TwitchieClientWrapper = TwitchieClientWrapper;
exports.default = new TwitchieClientWrapper();
//# sourceMappingURL=index.js.map