import { render, screen } from '~webapp/test-utils'

import { AppHeaderComponent } from './header.component'

describe('AppHeaderComponent', () => {
  it('should render', async () => {
    await render(AppHeaderComponent)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
