import { HelixFollow, HelixStream, HelixUser } from 'twitch'

import { FollowInfo, StreamInfo, UserInfo } from '../../../common/replicants'
import context from '../../context'

let updateTimeout: NodeJS.Timeout

const serializeUserInfo = (user?: HelixUser | null): UserInfo | undefined => {
  if (!user) {
    return undefined
  }

  return {
    id: user.id,
    login: user.name,
    display_name: user.displayName,
    description: user.description,
    type: user.type,
    broadcaster_type: user.broadcasterType,
    profile_image_url: user.profilePictureUrl,
    offline_image_url: user.offlinePlaceholderUrl,
    view_count: user.views,
  }
}

const serializeStreamInfo = (stream?: HelixStream | null): StreamInfo | undefined => {
  if (!stream) {
    return undefined
  }

  return {
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
  }
}

const serializeFollowInfo = (follows: HelixFollow[]): FollowInfo[] =>
  follows.map(follow => ({
    followed_at: follow.followDate.getTime(),
    from_id: follow.userId,
    from_name: follow.userDisplayName,
    to_id: follow.followedUserId,
    to_name: follow.followedUserDisplayName,
  }))

const getFreshChannelInfo = () => {
  const userId = context.replicants.user.id.value

  if (!userId) {
    return Promise.reject('No Twitch user ID is currently set')
  }

  return Promise.all([
    context.twitch.api!.helix.streams.getStreamByUserId(userId),
    context.twitch.api!.helix.users.getUserById(userId),
    context.twitch.api!.helix.users.getFollows({ followedUser: userId }),
  ])
}

const update = async () => {
  clearTimeout(updateTimeout)

  try {
    const [streamInfo, userInfo, followers] = await getFreshChannelInfo()

    context.replicants.stream.info.value = serializeStreamInfo(streamInfo)
    context.replicants.user.info.value = serializeUserInfo(userInfo)
    context.replicants.user.followers.value = serializeFollowInfo(followers.data)
  } catch (error) {
    context.log.error("Couldn't retrieve channel info :()", error)
  }

  updateTimeout = setTimeout(update, context.config.timeBetweenUpdates)
}

context.replicants.user.id.on('change', newUserId => {
  context.replicants.stream.info.value = undefined
  context.replicants.user.followers.value = undefined

  if (newUserId) {
    update()
  } else {
    clearTimeout(updateTimeout)
  }
})
