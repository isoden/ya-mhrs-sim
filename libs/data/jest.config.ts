/* eslint-disable */
const esmPackages = ['lodash-es'].join('|')

export default {
  displayName: 'data',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  // https://github.com/nrwl/nx/issues/812
  transformIgnorePatterns: [`node_modules/(?!${esmPackages})`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/data',
}
