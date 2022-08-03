/* eslint-disable */
const esmPackages = ['lodash-es'].join('|')

export default {
  displayName: 'webapp',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../coverage/apps/webapp',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  // https://github.com/nrwl/nx/issues/812
  // ['node_modules/(?!.*\\.mjs$)', `node_modules/(?!${esmPackages})`] だとダメだった
  transformIgnorePatterns: [`node_modules/(?!.*\\.mjs$|${esmPackages})`],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
}
