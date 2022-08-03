import { render, screen } from '@testing-library/angular'

import { ButtonComponent } from './button.component'

describe('ButtonComponent', () => {
  it('should render', async () => {
    await render('<button type="button" uic-button>fancy button</button>', {
      declarations: [ButtonComponent],
    })

    expect(screen.getByRole('button')).toHaveTextContent('fancy button')
  })
})
