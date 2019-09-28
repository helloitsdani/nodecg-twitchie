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
const context_1 = __importDefault(require("../../context"));
const { twitch, nodecg, replicants, config } = context_1.default;
const { user, stream } = replicants;
let updateTimeout;
const fetchFollowers = () => __awaiter(void 0, void 0, void 0, function* () {
    const follows = yield twitch.api.helix.users.getFollows({ followedUser: user.id.value });
    console.log(follows);
    return follows;
});
// if a stream is active, the api response will contain the
// channel's information as well; therefore, we only need to
// specifically request it if no stream is active
const fetchInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const streamInfo = yield twitch.api.helix.streams.getStreamByUserId(user.id.value);
    if (streamInfo) {
        return {
            stream: streamInfo,
        };
    }
    const channelInfo = yield twitch.api.helix.users.getUserById(user.id.value);
    return {
        channel: channelInfo,
    };
});
const update = () => {
    clearTimeout(updateTimeout);
    Promise.all([fetchInfo(), fetchFollowers()])
        .then(([info, followers]) => {
        // channel.info.value = Object.assign({}, info.channel)
        // channel.followers.value = [...followers]
        // stream.info.value = Object.assign({}, info.stream)
        console.log(info, followers);
    })
        .catch(err => {
        nodecg.log.error("Couldn't retrieve channel info :()", err);
    })
        .then(() => {
        updateTimeout = setTimeout(update, config.timeBetweenUpdates);
    });
};
user.id.on('change', (newUserId) => {
    user.info.value = undefined;
    user.followers.value = undefined;
    stream.info.value = undefined;
    if (newUserId) {
        update();
    }
    else {
        clearTimeout(updateTimeout);
    }
});
//# sourceMappingURL=poll.js.map