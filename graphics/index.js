var ChatMessageType;
(function (ChatMessageType) {
    ChatMessageType["ACTION"] = "action";
    ChatMessageType["MESSAGE"] = "message";
})(ChatMessageType || (ChatMessageType = {}));

const NAMESPACE = 'nodecg-twitchie';

const createReplicant = (nodecg, name, { defaultValue, persistent } = {}) => nodecg.Replicant(name, NAMESPACE, {
    defaultValue,
    persistent: !!persistent,
});
var createReplicants = (nodecg, defaults = {}) => {
    const createReplicantWithDefault = (name) => createReplicant(nodecg, name, defaults[name]);
    return {
        channel: {
            id: createReplicantWithDefault('channel.id'),
        },
        stream: {
            info: createReplicantWithDefault('stream.info'),
        },
        game: {
            id: createReplicantWithDefault('game.id'),
            info: createReplicantWithDefault('game.info'),
        },
        user: {
            id: createReplicantWithDefault('user.id'),
            info: createReplicantWithDefault('user.info'),
            followers: createReplicantWithDefault('user.followers'),
        },
        chat: {
            channel: createReplicantWithDefault('chat.channel'),
            badges: createReplicantWithDefault('chat.badges'),
            cheermotes: createReplicantWithDefault('chat.cheermotes'),
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
