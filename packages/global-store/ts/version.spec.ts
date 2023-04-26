import { expect, it } from '@jest/globals'
import { compareVersion } from './version.js'

it('processed > current returns positive', () => {
  expect(compareVersion('1.0.0', '0.2.3') > 0).toBeTruthy()
})

it('processed < current returns negative', () => {
  expect(compareVersion('1.0.0', '1.2.3') < 0).toBeTruthy()
})
