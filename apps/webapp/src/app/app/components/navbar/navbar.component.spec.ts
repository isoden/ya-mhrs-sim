import { render, screen } from '~webapp/test-utils'

import { AppNavbarComponent } from './navbar.component'

describe('AppNavbarComponent', () => {
  it('should render', async () => {
    await render(AppNavbarComponent)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
