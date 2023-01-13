import { render, screen } from '~webapp/test-utils'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { MyArmorsPageComponent } from './my-armors-page.component'
import { ClipboardModule } from '@angular/cdk/clipboard'

describe('MyArmorsPageComponent', () => {
  it('should render', async () => {
    await render(MyArmorsPageComponent, {
      imports: [MatSnackBarModule, ClipboardModule],
    })

    expect(screen.getByRole('heading', { name: /傀異錬成防具管理/ })).toBeTruthy()
  })
})
