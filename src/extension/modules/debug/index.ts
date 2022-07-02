import context from '../../context'

context.nodecg.listenFor('debug.user.follower', ({ username }) => {
  context.events.emitMessage('user.follower', {
    from_name: username,
    to_name: context.replicants.channel.id.value ?? '',
    from_id: '',
    to_id: '',
    followed_at: Date.now(),
  })
})

context.nodecg.listenFor('debug.user.subscription', ({ username }) => {
  context.events.emitMessage('user.subscription', {
    name: username,
    message: "hello i'm a test user and i love #content :)",
    months: 69,
    streak: 69,
    plan: '',
    planName: 'coolsub',
    isPrime: false,
  })
})

context.nodecg.listenFor('debug.user.subscription.gift', ({ username }) => {
  context.events.emitMessage('user.subscription.gift', {
    name: username,
    message: 'honestly im not really sure who sends this message',
    months: 12,
    streak: 1,
    giftDuration: 1,
    gifter: 'santaclaus',
    gifterGiftCount: 111,
    plan: '',
    planName: 'coolsub',
    isPrime: false,
  })
})

context.nodecg.listenFor('debug.user.subscription.community', ({ username }) => {
  context.events.emitMessage('user.subscription.community', {
    count: 69,
    gifter: username,
    gifterDisplayName: username,
    gifterGiftCount: 420,
    plan: '',
  })
})
