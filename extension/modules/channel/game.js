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
const node_cache_1 = __importDefault(require("node-cache"));
const context_1 = __importDefault(require("../../context"));
const cache = new node_cache_1.default();
const serializeGameInfo = (game) => {
    if (!game) {
        return undefined;
    }
    return {
        id: game.id,
        name: game.name,
        box_art_url: game.boxArtUrl,
    };
};
const fetchGameInfo = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context_1.default.twitch.api) {
        throw new Error('Twitch API unavailable');
    }
    context_1.default.log.debug(`Looking up game #${gameId} from API...`);
    const gameInfo = yield context_1.default.twitch.api.helix.games.getGameById(gameId);
    const serializedGameInfo = serializeGameInfo(gameInfo);
    if (!serializedGameInfo) {
        throw new Error(`Unknown Game ID: ${gameId}`);
    }
    return serializedGameInfo;
});
const fetchGameInfoWithCache = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedGameInfo = cache.get(gameId);
    if (cachedGameInfo) {
        context_1.default.log.debug(`Game #${gameId} found in cache`);
        return cachedGameInfo;
    }
    const gameInfo = yield fetchGameInfo(gameId);
    cache.set(gameId, gameInfo);
    return gameInfo;
});
const updateGameInfo = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const gameInfo = yield fetchGameInfoWithCache(gameId);
    context_1.default.replicants.game.info.value = gameInfo;
});
context_1.default.replicants.game.id.on('change', gameId => {
    if (!gameId) {
        context_1.default.replicants.game.info.value = undefined;
        return;
    }
    updateGameInfo(gameId);
});
//# sourceMappingURL=game.js.map