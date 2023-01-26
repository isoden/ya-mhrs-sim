import { render, screen } from '@testing-library/angular'
import { PrettyNumberDirective } from './pretty-number.directive'

describe('PrettyNumberDirective', () => {
  it('正の数の場合プラス記号をつけて表示する', async () => {
    await render(`<uic-pretty-number [value]="5">5</uic-pretty-number>`, {
      declarations: [PrettyNumberDirective],
    })

    const number = screen.getByText('5')

    expect(number).toBeInTheDocument()
    expect(number).toHaveClass('text-green-500 dark:text-green-400')
  })

  it('負の数の場合マイナス記号をつけて表示する', async () => {
    await render(`<uic-pretty-number [value]="-5">-5</uic-pretty-number>`, {
      declarations: [PrettyNumberDirective],
    })

    const number = screen.getByText('-5')

    expect(number).toBeInTheDocument()
    expect(number).toHaveClass('text-red-500 dark:text-red-400')
  })
})
