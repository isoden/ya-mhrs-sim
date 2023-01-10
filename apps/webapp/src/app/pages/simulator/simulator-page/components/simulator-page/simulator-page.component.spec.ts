import { render, screen } from '~webapp/test-utils'

import { SimulatorPageComponent } from './simulator-page.component'

describe('SimulatorPageComponent', () => {
  it('should render', async () => {
    await render(SimulatorPageComponent)

    expect(screen.getByRole('heading', { name: /スキルシミュレーター/ })).toBeInTheDocument()
  })
})
