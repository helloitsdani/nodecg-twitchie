"use strict";
/* global nodecg */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../common/constants");
const listenFor = (name, handler) => nodecg.listenFor(name, constants_1.NAMESPACE, handler);
exports.default = listenFor;
//# sourceMappingURL=listenFor.js.map