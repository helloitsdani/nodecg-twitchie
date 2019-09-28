"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("../../context"));
const getChatChannelFor_1 = __importDefault(require("../../utils/getChatChannelFor"));
const { twitch, replicants } = context_1.default;
const { channel, user } = replicants;
const isUserInChannel = (channelName) => twitch.client.getChannels().includes(channelName);
// leave chat immediately when channel ID is changed;
// there might be a content reason we want to change ASAP
// so we shouldn't wait for user resolution...
channel.id.on('change', (_, oldChannel) => {
    if (!oldChannel) {
        return;
    }
    const channelToPart = getChatChannelFor_1.default(oldChannel);
    if (!isUserInChannel(channelToPart)) {
        return;
    }
    twitch.client.part(channelToPart);
});
// only try and join a channel when we're sure the provided
// channel id actually resolves to a real user
// trying to join nonexistent channels on twitch irc can
// cause issues
user.id.on('change', (newUserId) => {
    if (!newUserId) {
        return;
    }
    const channelToJoin = getChatChannelFor_1.default(channel.id.value);
    twitch.client.join(channelToJoin);
});
//# sourceMappingURL=channel.js.map