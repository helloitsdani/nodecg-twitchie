"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EMOTE_PREFIX = 'http://static-cdn.jtvnw.net/emoticons/v1';
exports.EMOTE_PREFIX = EMOTE_PREFIX;
const getEmote = (name, size = '3.0') => `${EMOTE_PREFIX}/${name}/${size}`;
exports.default = getEmote;
//# sourceMappingURL=getEmote.js.map