const nxPreset = require('@nrwl/jest/preset').default

module.exports = {
  ...nxPreset,
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
}
