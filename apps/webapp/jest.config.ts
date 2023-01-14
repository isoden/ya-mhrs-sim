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
  moduleNameMapper: {
    // Jest で import.meta.url がエラーになる問題。
    // 正攻法だと解決できそうになかったので Worker の呼び出しをモックに差し替えて対応。
    // https://github.com/nrwl/nx/issues/5697#issuecomment-1068899210
    // https://github.com/isoden/ya-mhrs-sim/issues/10
    '\\/worker.factory$': '<rootDir>/src/app/services/simulator/worker.factory.mock.ts',
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
