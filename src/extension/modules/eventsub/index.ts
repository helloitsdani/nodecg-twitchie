// import { EventSubWsListener } from '@twurple/eventsub-ws'

// import context from '../../context'

// let eventsub: EventSubWsListener

// context.replicants.user.id.on('change', (newUserId) => {
//   context.log.debug(`userID: ${newUserId}...`)

//   if (eventsub) {
//     eventsub.stop()
//   }

//   if (!newUserId) {
//     return
//   }

//   context.log.debug(`Creating eventsub websocket for userID ${newUserId}...`)

//   eventsub.onChannelFollow(newUserId, newUserId, (...params) => {
//     console.log(params)
//   })

//   eventsub.start()
// })
