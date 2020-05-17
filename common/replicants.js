"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const createReplicant = (nodecg, name, { defaultValue, persistent = true } = {}) => nodecg.Replicant(name, constants_1.NAMESPACE, {
    defaultValue,
    persistent: !!persistent,
});
exports.createReplicant = createReplicant;
exports.default = (nodecg, defaults = {}) => {
    const createReplicantWithDefault = (name, persistent) => createReplicant(nodecg, name, { persistent, defaultValue: defaults[name] });
    return {
        channel: {
            id: createReplicantWithDefault('channel.id', false),
        },
        stream: {
            info: createReplicantWithDefault('stream.info', false),
        },
        game: {
            id: createReplicantWithDefault('game.id', false),
            info: createReplicantWithDefault('game.info', false),
        },
        user: {
            id: createReplicantWithDefault('user.id', false),
            info: createReplicantWithDefault('user.info', false),
            followers: createReplicantWithDefault('user.followers', false),
        },
        chat: {
            channel: createReplicantWithDefault('chat.channel', false),
            badges: createReplicantWithDefault('chat.badges', false),
            cheermotes: createReplicantWithDefault('chat.cheermotes', false),
        },
    };
};
//# sourceMappingURL=replicants.js.map