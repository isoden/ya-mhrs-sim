import { render, screen } from '~webapp/test-utils'
import { APP_VERSION_PROVIDER } from '../../appVersion'

import { AppHeaderComponent } from './header.component'

describe('AppHeaderComponent', () => {
  it('should render', async () => {
    await render(AppHeaderComponent, {
      providers: [APP_VERSION_PROVIDER],
    })

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
