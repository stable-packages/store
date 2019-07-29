import { compareVersion } from './compareVersion'

test('processed > current returns positive', () => {
  expect(compareVersion('1.0.0', '0.2.3') > 0).toBeTruthy()
})

test('processed < current returns negative', () => {
  expect(compareVersion('1.0.0', '1.2.3') < 0).toBeTruthy()
})
