import NodeCache from 'node-cache'
import { HelixGame } from 'twitch'

import { GameInfo } from '../../../types'
import context from '../../context'

const cache = new NodeCache()

const serializeGameInfo = (game?: HelixGame | null): GameInfo | undefined => {
  if (!game) {
    return undefined
  }

  return {
    id: game.id,
    name: game.name,
    box_art_url: game.boxArtUrl,
  }
}

const fetchGameInfo = async (gameId: string): Promise<GameInfo> => {
  if (!context.twitch.api) {
    throw new Error('Twitch API unavailable')
  }

  context.log.debug(`Looking up game #${gameId} from API...`)
  const gameInfo = await context.twitch.api!.helix.games.getGameById(gameId)
  const serializedGameInfo = serializeGameInfo(gameInfo)

  if (!serializedGameInfo) {
    throw new Error(`Unknown Game ID: ${gameId}`)
  }

  return serializedGameInfo
}

const fetchGameInfoWithCache = async (gameId: string): Promise<GameInfo> => {
  const cachedGameInfo = cache.get<GameInfo>(gameId)

  if (cachedGameInfo) {
    context.log.debug(`Game #${gameId} found in cache`)
    return cachedGameInfo
  }

  const gameInfo = await fetchGameInfo(gameId)

  cache.set<GameInfo>(gameId, gameInfo)
  return gameInfo
}

const updateGameInfo = async (gameId: string) => {
  const gameInfo = await fetchGameInfoWithCache(gameId)
  context.replicants.game.info.value = gameInfo
}

context.replicants.game.id.on('change', (gameId, oldGameId) => {
  if (!gameId) {
    context.replicants.game.info.value = undefined
    return
  }

  if (gameId === oldGameId) {
    return
  }

  updateGameInfo(gameId)
})
