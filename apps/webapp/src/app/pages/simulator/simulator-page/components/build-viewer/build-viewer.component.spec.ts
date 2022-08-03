import { render, screen } from '@testing-library/angular'

import { BuildViewerComponent } from './build-viewer.component'

describe('BuildViewerComponent', () => {
  it('should render', async () => {
    await render(BuildViewerComponent, {
      componentProperties: {
        build: {
          weapon: undefined,
          helm: undefined,
          chest: undefined,
          arm: undefined,
          waist: undefined,
          leg: undefined,
          talisman: undefined,
          decorations: [],
          defense: 0,
          fireResistance: 0,
          waterResistance: 0,
          thunderResistance: 0,
          iceResistance: 0,
          dragonResistance: 0,
        },
      },
    })

    expect(screen.getAllByRole('table')[0]).toBeInTheDocument()
  })
})
