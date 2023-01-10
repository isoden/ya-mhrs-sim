import { render, screen, within } from '~webapp/test-utils'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { MyTalismansPageComponent } from './my-talismans-page.component'

describe('MyTalismansPageComponent', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'alert')
      .mockImplementation(/* jsdom 上で実装されておらず `Error: Not implemented: window.alert` の警告が出るため空の実装を定義 */)
  })

  it('should render', async () => {
    await render(MyTalismansPageComponent, {
      imports: [MatSnackBarModule],
    })
    expect(screen.getByRole('heading', { name: /護石管理/ })).toBeInTheDocument()
  })

  it('CSVをインポートできる', async () => {
    const { user } = await render(MyTalismansPageComponent, {
      imports: [MatSnackBarModule],
    })

    const textarea = screen.getByRole('textbox')
    const empty = screen.getByRole('cell', { name: /データが未登録です/ })

    // assert: 事前条件: empty state が表示されている
    expect(empty).toBeInTheDocument()

    // act: データを CSV 形式で 2 件入力
    await user.type(textarea, '攻撃,1,,,1,1,0{enter}壁面移動,1,壁面移動【翔】,1,0,0,0')
    await user.click(screen.getByRole('button', { name: /CSVをインポート/ }))

    expect(empty).not.toBeInTheDocument()

    const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')

    // assert: データが 2 件表示されている
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('攻撃Lv1【1】【1】')
    expect(rows[1]).toHaveTextContent('壁面移動Lv1, 壁面移動【翔】Lv1')
  })

  it('テキストが空の場合は警告を表示する', async () => {
    const { user } = await render(MyTalismansPageComponent, {
      imports: [MatSnackBarModule],
    })

    const textarea = screen.getByRole('textbox')

    await user.type(textarea, '  {enter}{enter}')
    await user.click(screen.getByRole('button', { name: /CSVをインポート/ }))

    expect(window.alert).toHaveBeenCalledWith('データを入力してください')
  })

  it('不備があるデータを除いてインポートする', async () => {
    const { user } = await render(MyTalismansPageComponent, {
      imports: [MatSnackBarModule],
    })

    const textarea = screen.getByRole('textbox')

    await user.type(textarea, '攻撃,1,,,1,1,0{enter}翔虫使い,1,,,0,0,0')
    await user.click(screen.getByRole('button', { name: /CSVをインポート/ }))

    expect(window.alert).toHaveBeenCalledWith(['2行目: 読み込みエラー'])

    const rows = within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')

    // assert: データが 2 件表示されている
    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveTextContent('攻撃Lv1【1】【1】')
  })

  it('登録したデータを CSV でエクスポートできる', async () => {
    // arrange: 護石データの登録
    localStorage.setItem(
      'talismans',
      JSON.stringify([
        { skills: [['攻撃', 1]], slots: [1, 1] },
        {
          skills: [
            ['壁面移動', 1],
            ['壁面移動【翔】', 1],
          ],
          slots: [],
        },
      ]),
    )
    const writeText = jest.spyOn(navigator.clipboard, 'writeText')

    const { user } = await render(MyTalismansPageComponent, {
      imports: [MatSnackBarModule],
    })

    await user.click(screen.getByRole('button', { name: /エクスポート/ }))

    // assert: クリップボードに CSV が書き込まれている
    expect(writeText).toHaveBeenCalledWith(`攻撃,1,,0,1,1,0
壁面移動,1,壁面移動【翔】,1,0,0,0`)
  })
})
