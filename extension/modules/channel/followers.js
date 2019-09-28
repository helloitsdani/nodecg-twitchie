"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("../../context"));
const { events, replicants } = context_1.default;
const { user } = replicants;
user.followers.on('change', (newValue, oldValue) => {
    if (!oldValue || !newValue) {
        return;
    }
    const followers = oldValue.map(follower => follower.userDisplayName);
    newValue.every(follower => {
        const isNewFollower = !followers.includes(follower.userDisplayName);
        if (isNewFollower) {
            events.emitMessage({
                scope: 'channel',
                action: 'follower',
                payload: follower,
            });
        }
        return isNewFollower;
    });
});
//# sourceMappingURL=followers.js.map