import { render, screen } from '@testing-library/angular'

import { AppNavbarComponent } from './navbar.component'

describe('AppNavbarComponent', () => {
  it('should render', async () => {
    await render(AppNavbarComponent)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
