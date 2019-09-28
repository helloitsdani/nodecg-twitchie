"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const getMessageKey = (scope, action) => `${scope ? `${scope}.` : ''}${action}`;
exports.default = (nodecg) => {
    const emitter = new events_1.default();
    // convenience method for emitting events at the same time as
    // updating/broadcasting channel information
    emitter.emitMessage = ({ action, scope, payload }) => {
        const key = getMessageKey(scope, action);
        nodecg.sendMessage(key, payload);
        emitter.emit(key, payload);
    };
    return emitter;
};
//# sourceMappingURL=events.js.map