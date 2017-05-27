import test from 'ava'

import {
  tokeniseMessage,
  sortTokens,
  getEmoteTokens,
  getCheermoteTokens,
  parseTokens,
} from '../parseMessage'

test('tokeniseMessage: handles invalid parameters', (t) => {
  t.deepEqual(
    tokeniseMessage(),
    []
  )

  t.deepEqual(
    tokeniseMessage('test passthrough message'),
    [{
      type: 'text',
      content: 'test passthrough message',
    }]
  )
})

test('tokeniseMessage: creates tokens for each provided instance', (t) => {
  const tokens = tokeniseMessage(
    'hello :~) this => is my message!! :~D',
    [
      {
        type: 'big smile',
        start: 6,
        end: 8,
        content: ':~)'
      },
      {
        type: 'arrow',
        start: 15,
        end: 16,
        content: '=>'
      },
      {
        type: 'bigger smile',
        start: 34,
        end: 36,
        content: ':~D'
      },
    ]
  )

  t.truthy(
    tokens.filter(
      ({ type, content }) => type === 'big smile' && content === ':~)'
    ).length
  )

  t.truthy(
    tokens.filter(
      ({ type, content }) => type === 'arrow' && content === '=>'
    ).length
  )

  t.truthy(
    tokens.filter(
      ({ type, content }) => type === 'bigger smile' && content === ':~D'
    ).length
  )
})

test('tokeniseMessage: creates text tokens inbetween instances', (t) => {
  const tokens = tokeniseMessage(
    'hello :~) this => is my message!! :~D',
    [
      {
        type: 'big smile',
        start: 6,
        end: 8,
        content: ':~)'
      },
      {
        type: 'arrow',
        start: 15,
        end: 16,
        content: '=>'
      },
      {
        type: 'bigger smile',
        start: 34,
        end: 36,
        content: ':~D'
      },
    ]
  )

  t.is(
    tokens.filter(token => token.type === 'text').length,
    3
  )
})

test('tokeniseMessage: creates text tokens from trailing strings', (t) => {
  const tokens = tokeniseMessage(
    'hello :~) this => is my message!! :~D with a tail..........',
    [
      {
        type: 'big smile',
        start: 6,
        end: 8,
        content: ':~)'
      },
      {
        type: 'arrow',
        start: 15,
        end: 16,
        content: '=>'
      },
      {
        type: 'bigger smile',
        start: 34,
        end: 36,
        content: ':~D'
      },
    ]
  )

  t.deepEqual(
    tokens.pop(),
    {
      type: 'text',
      content: ' with a tail..........'
    }
  )
})

test('tokeniseMessage: results match expected', (t) => {
  const tokens = tokeniseMessage(
    'hello this is a test <3 test message!! test :O test :D<3 goodbye!',
    [
      {
        type: 'emote',
        start: 21,
        end: 22,
        content: '<3',
      },
      {
        type: 'emote',
        start: 44,
        end: 45,
        content: ':O',
      },
      {
        type: 'emote',
        start: 52,
        end: 53,
        content: ':D',
      },
      {
        type: 'emote',
        start: 54,
        end: 55,
        content: '<3',
      }
    ]
  )

  const expectedOutput = [
    { type: 'text', content: 'hello this is a test ' },
    { type: 'emote', content: '<3' },
    { type: 'text', content: ' test message!! test ' },
    { type: 'emote', content: ':O' },
    { type: 'text', content: ' test ' },
    { type: 'emote', content: ':D' },
    { type: 'emote', content: '<3' },
    { type: 'text', content: ' goodbye!' },
  ]

  t.deepEqual(tokens, expectedOutput)
})

test('sortTokens: orders tokens correctly', (t) => {
  const tokens = [
    {
      type: 'emote',
      start: 54,
      end: 55,
      content: '<3',
    },
    {
      type: 'emote',
      start: 21,
      end: 22,
      content: '<3',
    },
    {
      type: 'emote',
      start: 52,
      end: 53,
      content: ':D',
    },
    {
      type: 'emote',
      start: 44,
      end: 45,
      content: ':O',
    }
  ].sort(sortTokens)

  t.truthy(
    tokens.reduce(
      (isSorted, next, idx) => {
        if (isSorted === undefined) {
          return true
        }

        return next.start >= tokens[idx - 1].end
      }
    )
  )
})

test('getEmoteTokens: parses twitch token format and returns an ordered array of tokens', (t) => {
  const message = 'test! <3 vlambeerYV test vlambeerMimic :O test!'
  const emotes = {
    8: ['39-40'],
    9: ['6-7'],
    11934: ['9-18'],
    14038: ['25-37']
  }

  const tokens = [
    { type: 'emote', start: 6, end: 7, content: { key: '9', title: '<3' } },
    { type: 'emote', start: 9, end: 18, content: { key: '11934', title: 'vlambeerYV' } },
    { type: 'emote', start: 25, end: 37, content: { key: '14038', title: 'vlambeerMimic' } },
    { type: 'emote', start: 39, end: 40, content: { key: '8', title: ':O' } },
  ]

  t.deepEqual(
    getEmoteTokens(message, emotes),
    tokens
  )
})

test('getCheermoteTokens: parses cheermote instances and returns an array of tokens', (t) => {
  const message = 'test test cheer100 test test cheer100000 fakecheer300'
  const cheermotes = {
    cheer: { fake: true },
    fakecheer: { fake: true },
  }

  const expected = [
    { type: 'cheer', start: 10, end: 17, content: { title: 'cheer100', key: 'cheer', bits: '100' } },
    { type: 'cheer', start: 29, end: 39, content: { title: 'cheer100000', key: 'cheer', bits: '100000' } },
    { type: 'cheer', start: 41, end: 52, content: { title: 'fakecheer300', key: 'fakecheer', bits: '300' } },
  ]

  t.deepEqual(
    getCheermoteTokens(message, cheermotes),
    expected
  )
})

test('parseTokens: tokenises strings', (t) => {
  const tokeniser = () => ({ type: 'replaced' })
  const message = 'test test test'
  const expected = [{ type: 'replaced' }]

  t.deepEqual(
    parseTokens(message, tokeniser),
    expected
  )
})

test('parseTokens: only tokenises text tokens', (t) => {
  const tokeniser = () => ({ type: 'replaced' })
  const tokens = [
    { type: 'text', content: 'one!' },
    { type: 'saved' },
    { type: 'text', content: 'two!' },
    { type: 'saved' },
    { type: 'saved' },
    { type: 'text', content: 'three!' }
  ]

  const expected = [
    { type: 'replaced' },
    { type: 'saved' },
    { type: 'replaced' },
    { type: 'saved' },
    { type: 'saved' },
    { type: 'replaced' },
  ]

  t.deepEqual(
    parseTokens(tokens, tokeniser),
    expected
  )
})
