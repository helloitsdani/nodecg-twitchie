"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("../../context"));
// leave chat immediately when channel ID is changed;
// there might be a content reason we want to change ASAP
// so we shouldn't wait for user resolution...
context_1.default.replicants.channel.id.on('change', (_, oldChannel) => {
    if (!oldChannel) {
        return;
    }
    if (!context_1.default.twitch.client) {
        return;
    }
    try {
        context_1.default.twitch.client.part(oldChannel);
    }
    catch (e) {
        // Oh No!!
        console.log(e);
    }
});
// only try and join a channel when we're sure the provided
// channel id actually resolves to a real user
// trying to join nonexistent channels on twitch irc can
// cause issues
context_1.default.replicants.user.info.on('change', (newUserInfo) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newUserInfo) {
        return;
    }
    if (!context_1.default.twitch.client) {
        return;
    }
    yield context_1.default.twitch.client.join(newUserInfo.login);
    context_1.default.replicants.chat.channel.value = newUserInfo.login;
}));
//# sourceMappingURL=channel.js.map