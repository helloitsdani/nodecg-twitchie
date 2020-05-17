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
const debounce_1 = __importDefault(require("debounce"));
const node_cache_1 = __importDefault(require("node-cache"));
const context_1 = __importDefault(require("../../context"));
const guarantee_1 = __importDefault(require("../../utils/guarantee"));
const cache = new node_cache_1.default();
let pendingLookupHandle;
const fetchUserId = (username) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context_1.default.twitch.api) {
        throw new Error('Twitch API unavailable');
    }
    context_1.default.log.debug(`Looking up ${username} from API...`);
    const user = yield context_1.default.twitch.api.helix.users.getUserByName(username);
    if (!user) {
        throw new Error(`No user found called ${username}`);
    }
    return user.id;
});
const fetchUserIdWithCache = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedUserId = cache.get(username);
    if (cachedUserId) {
        context_1.default.log.debug(`${username} found in cache`);
        return cachedUserId;
    }
    const userId = yield fetchUserId(username);
    cache.set(username, userId);
    return userId;
});
const updateUserId = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield fetchUserIdWithCache(username);
        context_1.default.replicants.user.id.value = userId;
    }
    catch (e) {
        context_1.default.replicants.user.id.value = undefined;
    }
});
const guaranteedUpdateUserId = guarantee_1.default(updateUserId, { timeBetweenRetries: 10000 });
context_1.default.replicants.channel.id.on('change', debounce_1.default((username) => {
    context_1.default.replicants.user.id.value = undefined;
    if (!username) {
        return;
    }
    if (pendingLookupHandle) {
        pendingLookupHandle();
    }
    pendingLookupHandle = guaranteedUpdateUserId(username);
}, 1000));
//# sourceMappingURL=index.js.map