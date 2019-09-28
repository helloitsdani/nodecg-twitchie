"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("../context"));
const guarantee = (promiseFn, { timeBetweenRetries = 30000, logger = context_1.default.log } = {}) => {
    let retryPromise = Promise.resolve(undefined);
    let retryTimeout;
    const createPromise = (...params) => {
        clearTimeout(retryTimeout);
        retryPromise = promiseFn(...params);
        retryPromise.catch(error => {
            retryTimeout = setTimeout(() => createPromise(...params), timeBetweenRetries);
            logger.error(`Guranteed promise rejected! Retrying in ${timeBetweenRetries / 1000} seconds...`, error);
        });
        return retryPromise;
    };
    return (...params) => retryPromise.then(() => createPromise(...params)).catch(() => createPromise(...params));
};
exports.default = guarantee;
//# sourceMappingURL=guarantee.js.map