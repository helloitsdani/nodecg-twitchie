module.exports = (nodecg, events, twitch) => {
  const {
    chat,
    user,
  } = twitch.replicants

  user.id.on('change', (newVal) => {
    if (!newVal) {
      return
    }

    twitch.api.badges()
      .then((badges) => { chat.badges.value = badges })

    twitch.api.cheermotes({
      params: { channel_id: newVal }
    })
      .then((cheermotes) => { chat.cheermotes.value = cheermotes })
  })
}
