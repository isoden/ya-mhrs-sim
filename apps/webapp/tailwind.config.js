const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind')
const { join } = require('path')

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        header: '3.5rem', // h-14
      },
      height: {
        header: '3.5rem', // h-14
      },
    },
  },
  plugins: [],
}
