var ChatMessageType;
(function (ChatMessageType) {
    ChatMessageType["ACTION"] = "action";
    ChatMessageType["MESSAGE"] = "message";
})(ChatMessageType || (ChatMessageType = {}));

const NAMESPACE = 'nodecg-twitchie';

const createReplicant = (nodecg, name, { defaultValue, persistent = true } = {}) => nodecg.Replicant(name, NAMESPACE, {
    defaultValue,
    persistent: !!persistent,
});
var createReplicants = (nodecg, defaults = {}) => {
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

const replicants = createReplicants(nodecg);
const createLocalReplicant = (name, options) => createReplicant(nodecg, name, options);

const getBadge = (toFind, badges) => badges[toFind];

const getCheermoteFromCurrentSets = (name) => getBadge(name, replicants.chat.badges.value);

const EMOTE_PREFIX = 'http://static-cdn.jtvnw.net/emoticons/v1';
const getEmote = (name, size = '3.0') => `${EMOTE_PREFIX}/${name}/${size}`;

/* global nodecg */
const listenFor = (name, handler) => nodecg.listenFor(name, NAMESPACE, handler);

const client = Object.assign(Object.assign({}, replicants), { on: listenFor });

export default client;
export { ChatMessageType, createLocalReplicant as createReplicant, getBadge, getCheermoteFromCurrentSets as getBadgeFromCurrentSets, getEmote, listenFor };
//# sourceMappingURL=index.js.map
