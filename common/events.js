"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
exports.default = (nodecg) => {
    const emitter = new events_1.default();
    // convenience method for emitting events at the same time as
    // updating/broadcasting channel information
    emitter.emitMessage = (action, payload) => {
        nodecg.sendMessage(action, payload);
        emitter.emit(action, payload);
    };
    return emitter;
};
//# sourceMappingURL=events.js.map