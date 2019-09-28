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
const tmi_js_1 = __importDefault(require("tmi.js"));
const twitch_1 = __importDefault(require("twitch"));
const context_1 = __importDefault(require("../context"));
const getChatChannelFor_1 = __importDefault(require("../utils/getChatChannelFor"));
const chat_handlers_1 = __importDefault(require("./chat-handlers"));
const { config, log, replicants } = context_1.default;
class TwitchieClientWrapper {
    constructor() {
        this.isConnected = () => !!this.client;
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.disconnect();
            }
            catch (e) {
                // Oh Well
            }
            this.client = undefined;
        });
        this.connect = (auth) => __awaiter(this, void 0, void 0, function* () {
            this.auth = auth;
            log.debug('Connecting to twitch...');
            if (this.isConnected()) {
                yield this.disconnect();
            }
            const currentChannel = replicants.channel.id.value || this.auth.username;
            this.api = yield twitch_1.default.withCredentials(config.clientID, this.auth.token, undefined);
            this.client = new tmi_js_1.default.client({
                options: {
                    debug: true,
                },
                connection: {
                    reconnect: true,
                },
                identity: {
                    username: this.auth.username,
                    password: `oauth:${this.auth.token}`,
                },
                channels: [getChatChannelFor_1.default(currentChannel)],
                logger: log,
            });
            chat_handlers_1.default(this.client);
            try {
                yield this.client.connect();
                replicants.channel.id.value = currentChannel;
            }
            catch (error) {
                this.client = undefined;
                log.error('Could not connect to Twitch!', error);
                throw error;
            }
        });
    }
}
exports.TwitchieClientWrapper = TwitchieClientWrapper;
exports.default = new TwitchieClientWrapper();
//# sourceMappingURL=index.js.map