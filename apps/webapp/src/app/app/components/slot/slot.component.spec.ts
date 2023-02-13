import { render, screen } from '~webapp/test-utils'

import { SlotComponent } from './slot.component'

describe('SlotComponent', () => {
  it('should render', async () => {
    await render(SlotComponent, {
      componentProperties: {
        size: 1,
      },
    })

    expect(screen.getByRole('img')).toBeTruthy()
  })
})
