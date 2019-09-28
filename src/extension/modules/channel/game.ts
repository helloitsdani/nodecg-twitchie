import { HelixGame } from 'twitch'

import { GameInfo } from '../../../common/replicants'
import context from '../../context'

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

context.replicants.stream.info.on('change', async streamInfo => {
  if (!streamInfo) {
    context.replicants.stream.game.value = undefined
    return
  }

  const gameInfo = await context.twitch.api!.helix.games.getGameById(streamInfo.game_id)
  context.replicants.stream.game.value = serializeGameInfo(gameInfo)
})
