import { render, screen } from '~webapp/test-utils'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { MyArmorsPageComponent } from './my-armors-page.component'

describe('MyArmorsPageComponent', () => {
  it('should render', async () => {
    await render(MyArmorsPageComponent, {
      imports: [MatSnackBarModule],
    })

    expect(screen.getByRole('heading', { name: /傀異錬成防具管理/ })).toBeTruthy()
  })
})
