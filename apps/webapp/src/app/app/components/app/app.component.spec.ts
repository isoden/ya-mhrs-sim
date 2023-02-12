import { render, screen } from '~webapp/test-utils'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ServiceWorkerModule } from '@angular/service-worker'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('ライト/ダークモードを切り替えられる', async () => {
    const { user } = await render(AppComponent, {
      imports: [
        ServiceWorkerModule.register('/ngsw-script.js', { enabled: false }),
        MatSnackBarModule,
      ],
    })

    // assert: 事前条件
    expect(document.documentElement).not.toHaveClass('dark')

    await user.click(screen.getByRole('button', { name: /テーマを切り替える/ }))

    // assert: ダークモードを表すクラスが付与されている
    expect(document.documentElement).toHaveClass('dark')
  })

  it('ナビゲーションの折り畳みができる', async () => {
    const { user } = await render(AppComponent, {
      imports: [
        ServiceWorkerModule.register('/ngsw-script.js', { enabled: false }),
        MatSnackBarModule,
      ],
    })

    const button = screen.getByRole('button', { name: /メニューを開閉する/ })

    // assert: 関連付けられた要素が存在する
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(document.getElementById(button.getAttribute('aria-controls')!)).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
