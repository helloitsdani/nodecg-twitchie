"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = __importStar(require("../common/replicants"));
const replicants = replicants_1.default(nodecg);
const createLocalReplicant = (name, options) => replicants_1.createReplicant(nodecg, name, options);
exports.createReplicant = createLocalReplicant;
exports.default = replicants;
//# sourceMappingURL=replicants.js.map