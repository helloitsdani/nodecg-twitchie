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
let updateTimeout;
const serializeUserInfo = (user) => {
    if (!user) {
        return undefined;
    }
    return {
        id: user.id,
        login: user.name,
        display_name: user.displayName,
        description: user.description,
        type: user.type,
        broadcaster_type: user.broadcasterType,
        profile_image_url: user.profilePictureUrl,
        offline_image_url: user.offlinePlaceholderUrl,
        view_count: user.views,
    };
};
const serializeStreamInfo = (stream) => {
    if (!stream) {
        return undefined;
    }
    return {
        id: stream.id,
        user_id: stream.userId,
        user_name: stream.userDisplayName,
        game_id: stream.gameId,
        type: stream.type,
        title: stream.title,
        viewer_count: stream.viewers,
        started_at: stream.startDate.getTime(),
        language: stream.language,
        thumbnail_url: stream.thumbnailUrl,
    };
};
const mapFollowInfo = (follow) => ({
    followed_at: follow.followDate.getTime(),
    from_id: follow.userId,
    from_name: follow.userDisplayName,
    to_id: follow.followedUserId,
    to_name: follow.followedUserDisplayName,
});
const serializeFollowersInfo = (follows) => {
    if (!follows) {
        return undefined;
    }
    return {
        total: follows.total,
        followers: follows.data.map(mapFollowInfo),
    };
};
const getFreshChannelInfo = () => {
    const userId = context_1.default.replicants.user.id.value;
    if (!userId) {
        return Promise.reject('No Twitch user ID is currently set');
    }
    return Promise.all([
        context_1.default.twitch.api.helix.streams.getStreamByUserId(userId),
        context_1.default.twitch.api.helix.users.getUserById(userId),
        context_1.default.twitch.api.helix.users.getFollows({ followedUser: userId }),
    ]);
};
const update = () => __awaiter(void 0, void 0, void 0, function* () {
    clearTimeout(updateTimeout);
    try {
        const [streamInfo, userInfo, followers] = yield getFreshChannelInfo();
        context_1.default.replicants.stream.info.value = serializeStreamInfo(streamInfo);
        context_1.default.replicants.game.id.value = streamInfo ? streamInfo.gameId : undefined;
        context_1.default.replicants.user.info.value = serializeUserInfo(userInfo);
        context_1.default.replicants.user.followers.value = serializeFollowersInfo(followers);
    }
    catch (error) {
        context_1.default.log.error("Couldn't retrieve channel info :()", error);
    }
    updateTimeout = setTimeout(update, context_1.default.config.timeBetweenUpdates);
});
context_1.default.replicants.user.id.on('change', newUserId => {
    context_1.default.replicants.stream.info.value = undefined;
    context_1.default.replicants.game.id.value = undefined;
    context_1.default.replicants.user.info.value = undefined;
    context_1.default.replicants.user.followers.value = undefined;
    if (newUserId) {
        update();
    }
    else {
        clearTimeout(updateTimeout);
    }
});
//# sourceMappingURL=poll.js.map