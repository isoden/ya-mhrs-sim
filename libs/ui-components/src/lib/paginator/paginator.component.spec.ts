import { FormsModule } from '@angular/forms'
import { render, screen } from '@testing-library/angular'

import { IconsModule } from '../icons/icons.module'
import { PaginatorComponent } from './paginator.component'

describe('PaginatorComponent', () => {
  it('should render', async () => {
    const { change } = await render(PaginatorComponent, {
      imports: [FormsModule, IconsModule],
      componentProperties: {
        page: 1,
        length: 1225,
        pageSizes: [100, 200],
        pageSize: 100,
      },
    })

    expect(screen.getByTestId('page-current')).toHaveTextContent('1 - 100')

    change({ page: 2 })

    expect(screen.getByTestId('page-current')).toHaveTextContent('101 - 200')
  })
})
