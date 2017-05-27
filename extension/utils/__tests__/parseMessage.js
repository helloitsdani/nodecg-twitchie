import test from 'ava'

import {
  tokeniseMessage,
  sortTokens,
} from '../parseMessage'

test('tokeniseMessage: handles invalid parameters', (t) => {
  t.deepEqual(
    tokeniseMessage(),
    [{
      type: 'text',
      content: undefined,
    }]
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

test.skip('getEmoteTokens: parses twitch token format correctly', (t) => {
  t.fail()
})

test.skip('getEmoteTokens: returns an array of tokens sorted in occurrence order', (t) => {
  t.fail()
})

test.skip('getCheermoteTokens: parses out cheermote instances correctly', (t) => {
  t.fail()
})

test.skip('getCheermoteTokens: returns an array of tokens sorted in occurrence order', (t) => {
  t.fail()
})

test.skip('parseTokens: only tokenises text tokens', (t) => {
  t.fail()
})
