import { HelixStream, HelixUser } from '@twurple/api'

import { StreamInfo, UserInfo } from '../../../types'
import context from '../../context'

let updateTimeout: NodeJS.Timeout

const serializeUserInfo = (user: HelixUser): UserInfo | undefined => ({
  id: user.id,
  login: user.name,
  display_name: user.displayName,
  description: user.description,
  type: user.type,
  broadcaster_type: user.broadcasterType as any,
  profile_image_url: user.profilePictureUrl,
  offline_image_url: user.offlinePlaceholderUrl,
})

const serializeStreamInfo = (stream: HelixStream): StreamInfo | undefined => ({
  id: stream.id,
  user_id: stream.userId,
  user_name: stream.userDisplayName,
  game_id: stream.gameId,
  type: stream.type,
  title: stream.title,
  viewer_count: stream.viewers,
  started_at: stream.startDate.getTime(),
  language: stream.language,
  thumbnail_url: stream.thumbnailUrl,
})

const getFreshChannelInfo = () => {
  const userId = context.replicants.user.id.value

  if (!userId) {
    return Promise.reject('No Twitch user ID is currently set')
  }

  if (!context.twitch.api) {
    return Promise.reject('No Twitch API instance is available')
  }

  return Promise.all([
    context.twitch.api.streams.getStreamByUserId(userId),
    context.twitch.api.users.getUserById(userId),
  ])
}

const update = async () => {
  clearTimeout(updateTimeout)

  try {
    const [streamInfo, userInfo] = await getFreshChannelInfo()

    context.replicants.stream.info.value = streamInfo ? serializeStreamInfo(streamInfo) : undefined
    context.replicants.game.id.value = streamInfo ? streamInfo.gameId : undefined
    context.replicants.user.info.value = userInfo ? serializeUserInfo(userInfo) : undefined
  } catch (error) {
    context.log.error("Couldn't retrieve channel info :()", error)
  }

  updateTimeout = setTimeout(update, context.config.timeBetweenUpdates)
}

context.replicants.user.id.on('change', (newUserId) => {
  context.replicants.stream.info.value = undefined
  context.replicants.game.id.value = undefined
  context.replicants.user.info.value = undefined

  if (newUserId) {
    update()
  } else {
    clearTimeout(updateTimeout)
  }
})
