"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("../../context"));
context_1.default.replicants.user.followers.on('change', (newValue, oldValue) => {
    if (!oldValue || !newValue) {
        return;
    }
    const followers = oldValue.followers.map(follower => follower.from_name);
    newValue.followers.every(follower => {
        const isNewFollower = !followers.includes(follower.from_name);
        if (isNewFollower) {
            context_1.default.events.emitMessage('user.follower', follower);
        }
        return isNewFollower;
    });
});
//# sourceMappingURL=followers.js.map