import { render, screen } from '@testing-library/angular'
import { PrettyNumberComponent } from './pretty-number.component'

describe('PrettyNumberComponent', () => {
  it('正の数の場合プラス記号をつけて表示する', async () => {
    await render(PrettyNumberComponent, {
      componentProperties: {
        value: 5,
      },
    })

    const number = screen.getByText('+5')

    expect(number).toBeInTheDocument()
    expect(number).toHaveClass('text-green-500 dark:text-green-400')
  })

  it('負の数の場合マイナス記号をつけて表示する', async () => {
    await render(PrettyNumberComponent, {
      componentProperties: {
        value: -5,
      },
    })

    const number = screen.getByText('-5')

    expect(number).toBeInTheDocument()
    expect(number).toHaveClass('text-red-500 dark:text-red-400')
  })

  it('0 の場合 `-` を表示する', async () => {
    await render(PrettyNumberComponent, {
      componentProperties: {
        value: 0,
      },
    })

    const blank = screen.getByText('-')

    expect(blank).toBeInTheDocument()
  })

  it('0 の場合に fallback を表示する', async () => {
    await render(PrettyNumberComponent, {
      componentProperties: {
        value: 0,
        fallback: '??',
      },
    })

    const blank = screen.getByText('??')

    expect(blank).toBeInTheDocument()
  })
})
