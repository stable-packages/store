const isCI = require('is-ci')
module.exports = {
  'collectCoverageFrom': [
    '<rootDir>/ts/**/*.[jt]s',
    '!<rootDir>/ts/bin.[jt]s',
    '!<rootDir>/ts/type-checker/*'
  ],
  'roots': [
    '<rootDir>/ts',
  ],
  'reporters': isCI ? [
    'default',
    [
      'jest-junit',
      {
        'output': '.reports/junit/js-test-results.xml',
      },
    ],
  ] : [
    'default',
    'jest-progress-tracker'
  ],
  'testEnvironment': 'node',
  'testMatch': ['**/?(*.)+(spec|test|integrate|accept|system|unit).[jt]s?(x)'],
  'watchPlugins': [
    'jest-watch-suspend',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-toggle-config', { 'setting': 'verbose' },
    ],
    [
      'jest-watch-toggle-config', { 'setting': 'collectCoverage' },
    ],
  ],
}
