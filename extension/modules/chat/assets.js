"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("../../context"));
const guarantee_1 = __importDefault(require("../../utils/guarantee"));
const { replicants, config } = context_1.default;
const { user } = replicants;
const { timeBetweenRetries } = config;
const badgesLookup = () => Promise.resolve(null);
// twitch.api.badges().then((response: any) => {
//   chat.badges.value = response
// })
const cheermotesLookup = (_) => Promise.resolve(null);
// twitch.api
//   .cheermotes({
//     params: { channel_id: userId },
//   })
//   .then((response: any) => {
//     chat.cheermotes.value = response.actions.reduce(
//       (cheermotes: any, cheermote: any) =>
//         Object.assign({}, cheermotes, { [cheermote.prefix.toLowerCase()]: cheermote }),
//       {}
//     )
//   })
const guaranteedBadgesLookup = guarantee_1.default(badgesLookup, { timeBetweenRetries });
const guaranteedCheermotesLookup = guarantee_1.default(cheermotesLookup, { timeBetweenRetries });
user.id.on('change', (newVal) => {
    if (!newVal) {
        return;
    }
    guaranteedBadgesLookup();
    guaranteedCheermotesLookup(newVal);
});
//# sourceMappingURL=assets.js.map