const path = require('path');

module.exports = {
  setupFiles: [
    // path.join(__dirname, './setup-enzyme.js'),
  ],
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  // },
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // moduleNameMapper: {
  //   '@devexpress/(.*)$*': '<rootDir>/packages/$1/src',
    // '*': ['node_modules', '../'],
  // },
  testMatch: [
    '**/*.test.(ts|tsx)',
  ],
};
