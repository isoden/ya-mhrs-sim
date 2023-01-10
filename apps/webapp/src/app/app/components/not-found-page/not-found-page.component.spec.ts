import { render, screen } from '~webapp/test-utils'

import { NotFoundPageComponent } from './not-found-page.component'

describe('NotFoundPageComponent', () => {
  it('トップに戻るリンクがある', async () => {
    await render(NotFoundPageComponent)

    expect(
      screen.getByRole('link', {
        name: /トップページに戻る/,
      }),
    ).toBeInTheDocument()
  })
})
