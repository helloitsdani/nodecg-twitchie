import NodeCache from 'node-cache'
import { HelixGame } from '@twurple/api'

import { GameInfo } from '../../../types'
import context from '../../context'

const cache = new NodeCache()

const serializeGameInfo = (game: HelixGame): GameInfo => ({
  id: game.id,
  name: game.name,
  box_art_url: game.boxArtUrl,
})

const fetchGameInfo = async (gameId: string): Promise<GameInfo> => {
  if (!context.twitch.api) {
    throw new Error('Twitch API unavailable')
  }

  context.log.debug(`Looking up game #${gameId} from API...`)
  const game = await context.twitch.api.games.getGameById(gameId)

  if (!game) {
    throw new Error(`Unknown Game ID: ${gameId}`)
  }

  return serializeGameInfo(game)
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

context.replicants.game.id.on('change', (gameId) => {
  if (!gameId) {
    context.replicants.game.info.value = undefined
    return
  }

  updateGameInfo(gameId)
})
