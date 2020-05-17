"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = __importDefault(require("../replicants"));
const getBadge_1 = __importDefault(require("./getBadge"));
const getCheermoteFromCurrentSets = (name) => getBadge_1.default(name, replicants_1.default.chat.badges.value);
exports.default = getCheermoteFromCurrentSets;
//# sourceMappingURL=getBadgeFromCurrentSets.js.map