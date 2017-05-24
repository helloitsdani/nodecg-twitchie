/* global nodecg */

(((root, factory) => {
  // eslint-disable-next-line no-param-reassign
  root.twitchie = factory()
})(this, () => {
  const bundleName = 'nodecg-twitchie'
  const createReplicant = name => nodecg.Replicant(name, bundleName)
  const listenFor = (name, handler) => nodecg.listenFor(name, bundleName, handler)

  const replicants = {
    channel: {
      info: createReplicant('channel.info'),
      followers: createReplicant('channel.followers'),
    },
    stream: {
      info: createReplicant('stream.info'),
    },
    chat: {
      badges: createReplicant('chat.badges'),
      cheermotes: createReplicant('chat.cheermotes'),
    },
  }

  const getEmote = (
    name,
    {
      size = '3.0'
    } = {}
  ) => (
    `http://static-cdn.jtvnw.net/emoticons/v1/${name}/${size}`
  )

  const getCheermote = (
    name,
    bits,
    {
      type = 'animated',
      background = 'light',
      size = '4',
    } = {}
  ) => {
    const cheermotes = replicants.chat.cheermotes.value
    const alt = `${name}${bits}`

    if (!Object.keys(cheermotes).includes(name)) {
      return {
        alt,
      }
    }

    const cheermote = cheermotes[name].tiers.reduce(
      (previousTier, tier) => (
        bits >= tier.min_bits
          ? tier
          : previousTier
      )
    )

    const { color } = cheermote
    let url

    try {
      url = cheermote.images[background][type][size]

      if (!url) {
        throw new TypeError('Invalid extra options supplied')
      }
    } catch (e) {
      const {
        scales: [defaultScale],
        states: [defaultState],
        backgrounds: [defaultBackground],
      } = cheermotes[name]

      url = cheermote.images[defaultBackground][defaultState][defaultScale]
    }

    return {
      color,
      url,
      alt,
    }
  }

  return {
    channel: replicants.channel,
    stream: replicants.stream,
    chat: replicants.chat,
    on: listenFor,
    listenFor,
    getEmote,
    getCheermote,
  }
}))
