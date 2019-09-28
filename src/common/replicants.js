"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
exports.default = (nodecg, defaults = {}) => {
    const createReplicant = (name) => nodecg.Replicant(name, constants_1.NAMESPACE, {
        defaultValue: defaults[name],
        persistent: false,
    });
    return {
        channel: {
            id: createReplicant('channel.id'),
        },
        stream: {
            info: createReplicant('stream.info'),
        },
        user: {
            id: createReplicant('user.id'),
            info: createReplicant('user.info'),
            followers: createReplicant('user.followers'),
        },
        chat: {
            badges: createReplicant('chat.badges'),
            cheermotes: createReplicant('chat.cheermotes'),
        },
    };
};
//# sourceMappingURL=replicants.js.map