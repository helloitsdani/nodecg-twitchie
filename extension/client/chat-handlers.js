"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const context_1 = __importDefault(require("../context"));
const serializeSubscriberInfo = (subInfo) => ({
    name: subInfo.displayName,
    message: subInfo.message,
    months: subInfo.months,
    streak: subInfo.streak,
    plan: subInfo.plan,
    planName: subInfo.planName,
    isPrime: subInfo.isPrime,
});
const serializeSubscriberGiftInfo = (subInfo) => (Object.assign(Object.assign({}, serializeSubscriberInfo(subInfo)), { gifter: subInfo.gifter, gifterDisplayName: subInfo.gifterDisplayName, gifterGiftCount: subInfo.gifterGiftCount }));
const serializeCommunityGiftInfo = (giftInfo) => ({
    count: giftInfo.count,
    gifter: giftInfo.gifter,
    gifterDisplayName: giftInfo.gifterDisplayName,
    gifterGiftCount: giftInfo.gifterGiftCount,
    plan: giftInfo.plan,
});
const serializeUserInfo = (user) => ({
    id: user.userId,
    name: user.userName,
    username: user.userName,
    color: user.color,
    badges: Object.fromEntries(user.badges.entries()),
    isMod: user.isMod,
    isSubscriber: user.isSubscriber,
});
const serializeMessageInfo = (type, rawMessage, message) => ({
    type,
    user: serializeUserInfo(message.userInfo),
    message: rawMessage,
    tokens: message.parseEmotesAndBits(context_1.default.replicants.chat.cheermotes.value),
    isCheer: message.isCheer,
    totalBits: message.totalBits,
});
exports.default = (client) => {
    client.onAction((channel, _, raw, message) => {
        const payload = {
            channel,
            message: serializeMessageInfo(types_1.ChatMessageType.ACTION, raw, message),
        };
        context_1.default.events.emitMessage('chat.action', payload);
    });
    client.onPrivmsg((channel, _, raw, message) => {
        const payload = {
            channel,
            message: serializeMessageInfo(types_1.ChatMessageType.MESSAGE, raw, message),
        };
        context_1.default.events.emitMessage('chat.message', payload);
    });
    /* host */
    client.onHosted((channel, byChannel, auto, viewers) => {
        const payload = {
            channel,
            byChannel,
            auto,
            viewers: viewers || 0,
        };
        context_1.default.events.emitMessage('user.hosted', payload);
    });
    client.onRaid((channel, _, raidInfo) => {
        const payload = {
            channel,
            byChannel: raidInfo.displayName,
            viewers: raidInfo.viewerCount,
        };
        context_1.default.events.emitMessage('user.raid', payload);
    });
    /* subscriptions */
    client.onSub((_, __, subInfo) => {
        console.log('subscriber', subInfo);
        const payload = serializeSubscriberInfo(subInfo);
        context_1.default.events.emitMessage('user.subscription', payload);
    });
    client.onResub((_, __, subInfo) => {
        console.log('resub', subInfo);
        const payload = serializeSubscriberInfo(subInfo);
        context_1.default.events.emitMessage('user.subscription', payload);
    });
    // @ts-ignore
    client.onSubGift((_, __, subInfo) => {
        console.log('sub gift', subInfo);
        const payload = serializeSubscriberGiftInfo(subInfo);
        context_1.default.events.emitMessage('user.subscription.gift', payload);
    });
    // @ts-ignore
    client.onCommunitySub((channel, user, subInfo) => {
        console.log('community sub', subInfo);
        const payload = serializeCommunityGiftInfo(subInfo);
        context_1.default.events.emitMessage('user.subscription.community', payload);
    });
    /* rituals */
    client.onRitual((channel, user, ritualInfo) => {
        const payload = {
            channel,
            user,
            message: ritualInfo.message,
            ritualName: ritualInfo.ritualName,
        };
        context_1.default.events.emitMessage('chat.ritual', payload);
    });
    /* naughty management options */
    client.onChatClear(() => {
        context_1.default.events.emitMessage('chat.clear', undefined);
    });
    client.onMessageRemove((channel, messageId) => {
        const payload = { channel, messageId };
        context_1.default.events.emitMessage('chat.removeMessage', payload);
    });
    client.onTimeout((channel, user, duration) => {
        const payload = { channel, user, duration };
        context_1.default.events.emitMessage('chat.timeout', payload);
    });
    client.onBan((channel, user) => {
        const payload = { channel, user };
        context_1.default.events.emitMessage('chat.ban', payload);
    });
};
//# sourceMappingURL=chat-handlers.js.map