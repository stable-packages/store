import { shouldInvokeInitializer } from './shouldInvokeInitializer.js'

describe('numeric version', () => {
  test('true if no versions', () => {
    expect(shouldInvokeInitializer([], 0)).toBeTruthy()
  })

  test('true if no match major', () => {
    expect(shouldInvokeInitializer(['1.0.0'], 0)).toBeTruthy()
  })

  test('false if same version exist', () => {
    expect(shouldInvokeInitializer([0], 0)).toBeFalsy()
    expect(shouldInvokeInitializer([6], 6)).toBeFalsy()
  })
});

describe('string version', () => {
  test('true if no versions', () => {
    expect(shouldInvokeInitializer([], '1.0.0')).toBeTruthy()
  })

  test('true if no match major', () => {
    expect(shouldInvokeInitializer(['1.0.0'], '0.0.0')).toBeTruthy()
  })

  test('true if minor and patch is newer', () => {
    expect(shouldInvokeInitializer(['1.0.0'], '1.1.0')).toBeTruthy()
    expect(shouldInvokeInitializer(['1.0.0'], '1.0.1')).toBeTruthy()
  })

  test('false if same version exist', () => {
    expect(shouldInvokeInitializer([0], '0.0.0')).toBeFalsy()
    expect(shouldInvokeInitializer(['1.2.4'], '1.2.4')).toBeFalsy()
  })

  test('false if newer minor or patch already exist', () => {
    expect(shouldInvokeInitializer(['1.1.0'], '1.0.1')).toBeFalsy()
    expect(shouldInvokeInitializer(['1.0.2'], '1.0.1')).toBeFalsy()
  })
})
