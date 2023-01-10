import { render, screen } from '~webapp/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SoftwareLicensesPageComponent } from './software-licenses-page.component'

describe('SoftwareLicensesPageComponent', () => {
  beforeEach(() => {
    setupServer(
      rest.get('/3rdpartylicenses.txt', (req, res, ctx) =>
        res(ctx.text('@angular/animations\nMIT')),
      ),
    ).listen()
  })

  it('should render', async () => {
    await render(SoftwareLicensesPageComponent)

    expect(await screen.findByText('@angular/animations MIT')).toBeInTheDocument()
  })
})
