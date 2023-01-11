import { render, screen } from '~webapp/test-utils'

import { SimulatorWidgetComponent } from './simulator-widget.component'

describe('SimulatorWidgetComponent', () => {
  it('should render', async () => {
    await render(SimulatorWidgetComponent)

    expect(screen.getByRole('heading', { name: /検索結果/ })).toBeInTheDocument()
  })
})
