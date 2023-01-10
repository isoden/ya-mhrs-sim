import { render } from '~webapp/test-utils'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { SoftwareLicensesPageComponent } from './software-licenses-page.component'

describe('SoftwareLicensesPageComponent', () => {
  it('should render', async () => {
    await render(SoftwareLicensesPageComponent, {
      imports: [HttpClientTestingModule],
    })

    // TODO: MSW 導入後ライセンスを表示しているかどうかのテストを書く。 HttpClientTestingModule は使わない。
    expect(true).toBeTruthy()
  })
})
