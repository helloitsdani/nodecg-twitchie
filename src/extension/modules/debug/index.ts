import context from '../../context'

context.nodecg.listenFor('debug.user.follower', ({ username }) => {
  context.events.emitMessage('user.follower', {
    followDate: Date.now(),
    userDisplayName: username,
    userName: username,
  })
})

context.nodecg.listenFor('debug.user.subscription', ({ username }) => {
  context.events.emitMessage('user.subscription', {
    cumulativeMonths: 420,
    durationMonths: 69,
    messageText: "hello i'm a test user and i love online :)",
    streakMonths: 69,
    tier: '1000',
    userDisplayName: username,
    userName: username,
  })
})

context.nodecg.listenFor('debug.user.subscription.gift', ({ username }) => {
  context.events.emitMessage('user.subscription.gift', {
    amount: 1,
    cumulativeAmount: 1,
    gifterDisplayName: username,
    gifterName: username,
    isAnonymous: false,
    tier: '1000',
    recipientDisplayName: 'LUCKY_USER',
    recipientName: 'lucky_user',
  })
})

context.nodecg.listenFor('debug.user.subscription.community', ({ username }) => {
  context.events.emitMessage('user.subscription.gift', {
    amount: 69,
    cumulativeAmount: 69,
    gifterDisplayName: username,
    gifterName: username,
    isAnonymous: false,
    tier: '1000',
    recipientDisplayName: 'LUCKY_USER',
    recipientName: 'lucky_user',
  })
})
