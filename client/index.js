"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = __importStar(require("./replicants"));
exports.createReplicant = replicants_1.createReplicant;
const getBadge_1 = __importDefault(require("./utils/getBadge"));
exports.getBadge = getBadge_1.default;
const getBadgeFromCurrentSets_1 = __importDefault(require("./utils/getBadgeFromCurrentSets"));
exports.getBadgeFromCurrentSets = getBadgeFromCurrentSets_1.default;
const getEmote_1 = __importDefault(require("./utils/getEmote"));
exports.getEmote = getEmote_1.default;
const listenFor_1 = __importDefault(require("./utils/listenFor"));
exports.listenFor = listenFor_1.default;
const client = Object.assign(Object.assign({}, replicants_1.default), { on: listenFor_1.default });
exports.default = client;
//# sourceMappingURL=index.js.map