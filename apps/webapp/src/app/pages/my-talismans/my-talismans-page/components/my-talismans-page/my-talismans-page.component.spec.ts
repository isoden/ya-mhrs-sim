import { render, screen } from '@testing-library/angular'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { MyTalismansPageComponent } from './my-talismans-page.component'

describe('MyTalismansPageComponent', () => {
  it('should render', async () => {
    await render(MyTalismansPageComponent, {
      imports: [MatSnackBarModule],
    })
    expect(screen.getByRole('heading', { name: /護石管理/ })).toBeInTheDocument()
  })
})
