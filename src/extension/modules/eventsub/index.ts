import { EventSubWsListener } from '@twurple/eventsub-ws'

import context from '../../context'

let eventsub: EventSubWsListener

context.replicants.user.id.on('change', (newUserId) => {
  if (!newUserId || !context.twitch.api) {
    return
  }

  context.log.debug(`Creating eventsub websocket for userID ${newUserId}...`)

  if (eventsub) {
    context.log.debug('Stopping old eventsub socket...')
    eventsub.stop()
  }

  eventsub = new EventSubWsListener({
    apiClient: context.twitch.api,
  })

  /* Followers */
  eventsub.onChannelFollow(newUserId, newUserId, (event) => {
    context.events.emitMessage('user.follower', {
      followDate: event.followDate.getTime(),
      userDisplayName: event.userDisplayName,
      userName: event.userName,
    })
  })

  /* Subscriptions */
  eventsub.onChannelSubscriptionMessage(newUserId, (event) => {
    context.events.emitMessage('user.subscription', {
      cumulativeMonths: event.cumulativeMonths,
      durationMonths: event.durationMonths,
      messageText: event.messageText,
      streakMonths: event.streakMonths,
      tier: event.tier,
      userDisplayName: event.userDisplayName,
      userName: event.userDisplayName,
    })
  })

  eventsub.onChannelSubscriptionGift(newUserId, (event) => {
    context.events.emitMessage('user.subscription.gift', {
      amount: event.amount,
      cumulativeAmount: event.cumulativeAmount,
      gifterDisplayName: event.gifterDisplayName,
      gifterName: event.gifterName,
      isAnonymous: event.isAnonymous,
      tier: event.tier,
    })
  })

  /* Cheers */
  eventsub.onChannelCheer(newUserId, (event) => {
    context.events.emitMessage('user.cheer', {
      bits: event.bits,
      isAnonymous: event.isAnonymous,
      message: event.message,
      userName: event.userName,
      userDisplayName: event.userDisplayName,
    })
  })

  /* Shoutouts */
  eventsub.onChannelShoutoutCreate(newUserId, newUserId, (event) => {
    context.events.emitMessage('shoutout', {
      startDate: event.startDate.getTime(),
      viewerCount: event.viewerCount,
      shoutedOutBroadcasterName: event.shoutedOutBroadcasterName,
      shoutedOutBroadcasterDisplayName: event.shoutedOutBroadcasterDisplayName,
    })
  })

  /* Raids */
  eventsub.onChannelRaidTo(newUserId, (event) => {
    context.events.emitMessage('user.raid', {
      raidedBroadcasterDisplayName: event.raidedBroadcasterDisplayName,
      raidedBroadcasterName: event.raidedBroadcasterName,
      viewers: event.viewers,
    })
  })

  /* Polls */
  eventsub.onChannelPollBegin(newUserId, (event) => {
    context.events.emitMessage('poll.begin', {
      bitsPerVote: event.bitsPerVote,
      channelPointsPerVote: event.channelPointsPerVote,
      choices: event.choices.map((choice) => ({
        id: choice.id,
        title: choice.title,
        channelPointsVotes: 0,
        totalVotes: 0,
      })),
      endDate: event.endDate.getTime(),
      id: event.id,
      isBitsVotingEnabled: event.isBitsVotingEnabled,
      isChannelPointsVotingEnabled: event.isChannelPointsVotingEnabled,
      startDate: event.startDate.getTime(),
      status: 'running',
      title: event.title,
    })
  })

  eventsub.onChannelPollProgress(newUserId, (event) => {
    context.events.emitMessage('poll.progress', {
      bitsPerVote: event.bitsPerVote,
      channelPointsPerVote: event.channelPointsPerVote,
      choices: event.choices,
      endDate: event.endDate.getTime(),
      id: event.id,
      isBitsVotingEnabled: event.isBitsVotingEnabled,
      isChannelPointsVotingEnabled: event.isChannelPointsVotingEnabled,
      startDate: event.startDate.getTime(),
      status: 'running',
      title: event.title,
    })
  })

  eventsub.onChannelPollEnd(newUserId, (event) => {
    context.events.emitMessage('poll.progress', {
      bitsPerVote: event.bitsPerVote,
      channelPointsPerVote: event.channelPointsPerVote,
      choices: event.choices,
      endDate: event.endDate.getTime(),
      id: event.id,
      isBitsVotingEnabled: event.isBitsVotingEnabled,
      isChannelPointsVotingEnabled: event.isChannelPointsVotingEnabled,
      startDate: event.startDate.getTime(),
      status: event.status,
      title: event.title,
    })
  })

  /* Predictions */
  eventsub.onChannelPredictionBegin(newUserId, (event) => {
    context.events.emitMessage('prediction.begin', {
      id: event.id,
      lockDate: event.lockDate.getTime(),
      outcomes: event.outcomes.map((outcome) => ({
        id: outcome.id,
        title: outcome.title,
        users: 0,
        channelPoints: 0,
        topPredictors: [],
      })),
      startDate: event.startDate.getTime(),
      title: event.title,
      status: 'running',
      endDate: null,
      winningOutcome: null,
      winningOutcomeId: null,
    })
  })

  eventsub.onChannelPredictionProgress(newUserId, (event) => {
    context.events.emitMessage('prediction.progress', {
      id: event.id,
      lockDate: event.lockDate.getTime(),
      outcomes: event.outcomes,
      startDate: event.startDate.getTime(),
      title: event.title,
      status: 'running',
      endDate: null,
      winningOutcome: null,
      winningOutcomeId: null,
    })
  })

  eventsub.onChannelPredictionLock(newUserId, (event) => {
    context.events.emitMessage('prediction.lock', {
      id: event.id,
      lockDate: event.lockDate.getTime(),
      outcomes: event.outcomes,
      startDate: event.startDate.getTime(),
      title: event.title,
      status: 'locked',
      endDate: null,
      winningOutcome: null,
      winningOutcomeId: null,
    })
  })

  eventsub.onChannelPredictionEnd(newUserId, (event) => {
    context.events.emitMessage('prediction.begin', {
      id: event.id,
      lockDate: null,
      outcomes: event.outcomes,
      startDate: event.startDate.getTime(),
      title: event.title,
      status: event.status,
      endDate: event.endDate.getTime(),
      winningOutcome: event.winningOutcome,
      winningOutcomeId: event.winningOutcomeId,
    })
  })

  eventsub.start()
})
