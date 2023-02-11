import { render, screen, within } from '~webapp/test-utils'

import { SimulatorPageComponent } from './simulator-page.component'

describe('SimulatorPageComponent', () => {
  it('should render', async () => {
    const { user } = await render(SimulatorPageComponent)

    const widget = screen.getByRole('region', { name: /検索結果/ })

    // assert: 事前条件
    expect(widget).toHaveTextContent('スキルを選択してください')

    // act: 攻撃レベル7を選択
    await user.click(screen.getByLabelText('攻撃レベル7'))

    const list = await within(widget).findByRole('list', { name: /発動スキル/ })
    expect(list).toHaveTextContent('攻撃Lv7')
  })
})
