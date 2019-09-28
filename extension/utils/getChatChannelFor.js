"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// channel IDs need to be normalised for use in twitch irc;
// trying to part #User won't actually make you leave #user
const getChatChannelFor = (channelName) => `#${channelName.toLowerCase()}`;
exports.default = getChatChannelFor;
//# sourceMappingURL=getChatChannelFor.js.map