import { HunterTypes } from '@ya-mhrs-sim/data'
import { render, screen, within } from '~webapp/test-utils'

import { BuildViewerComponent } from './build-viewer.component'

describe('BuildViewerComponent', () => {
  it('スキルの合計値を表示する', async () => {
    await render(BuildViewerComponent, {
      componentProperties: {
        build: {
          decorations: [
            {
              name: '痛撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['弱点特効', 1]],
            },
            {
              name: '超心珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['超会心', 1]],
            },
            {
              name: '超心珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['超会心', 1]],
            },
            {
              name: '超心珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['超会心', 1]],
            },
            {
              name: '攻撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['攻撃', 1]],
            },
            {
              name: '攻撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['攻撃', 1]],
            },
            {
              name: '攻撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['攻撃', 1]],
            },
            {
              name: '攻撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['攻撃', 1]],
            },
            {
              name: '攻撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['攻撃', 1]],
            },
          ],
          defense: 760,
          fireResistance: 11,
          waterResistance: -9,
          thunderResistance: 1,
          iceResistance: -8,
          dragonResistance: -4,
          leg: {
            series: 'インゴットＸ',
            name: 'インゴットＸグリーヴ',
            type: 'leg',
            defense: 136,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [1, 1],
            fireResistance: -1,
            waterResistance: -1,
            thunderResistance: 1,
            iceResistance: 0,
            dragonResistance: 0,
            skills: [
              ['攻撃', 2],
              ['見切り', 2],
            ],
            decorations: [],
          },
          arm: {
            series: '陰陽ノ者',
            name: '陰陽ノ者【手甲】',
            type: 'arm',
            defense: 154,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [2, 2, 2],
            fireResistance: 2,
            waterResistance: 0,
            thunderResistance: -1,
            iceResistance: -3,
            dragonResistance: 1,
            skills: [
              ['煽衛', 1],
              ['挑戦者', 2],
              ['スタミナ急速回復', 1],
            ],
            decorations: [
              {
                name: '痛撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['弱点特効', 1]],
              },
              {
                name: '超心珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['超会心', 1]],
              },
              {
                name: '超心珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['超会心', 1]],
              },
            ],
          },
          waist: {
            series: '陰陽ノ者',
            name: '陰陽ノ者【当帯】',
            type: 'waist',
            defense: 154,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [2, 2, 1],
            fireResistance: 2,
            waterResistance: 0,
            thunderResistance: -1,
            iceResistance: -3,
            dragonResistance: 1,
            skills: [
              ['煽衛', 1],
              ['挑戦者', 3],
              ['巧撃', 1],
            ],
            decorations: [
              {
                name: '超心珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['超会心', 1]],
              },
              {
                name: '攻撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['攻撃', 1]],
              },
            ],
          },
          helm: {
            series: 'リバルカイザー',
            name: 'リバルカイザーホーン',
            type: 'helm',
            defense: 158,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [3, 2],
            fireResistance: 4,
            waterResistance: -4,
            thunderResistance: 1,
            iceResistance: -1,
            dragonResistance: -3,
            skills: [
              ['粉塵纏', 1],
              ['弱点特効', 1],
              ['見切り', 2],
            ],
            decorations: [
              {
                name: '攻撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['攻撃', 1]],
              },
              {
                name: '攻撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['攻撃', 1]],
              },
            ],
          },
          chest: {
            series: 'リバルカイザー',
            name: 'リバルカイザーメイル',
            type: 'chest',
            defense: 158,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [2, 2],
            fireResistance: 4,
            waterResistance: -4,
            thunderResistance: 1,
            iceResistance: -1,
            dragonResistance: -3,
            skills: [
              ['粉塵纏', 1],
              ['弱点特効', 1],
              ['見切り', 3],
            ],
            decorations: [
              {
                name: '攻撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['攻撃', 1]],
              },
              {
                name: '攻撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['攻撃', 1]],
              },
            ],
          },
        },
      },
    })

    const listItems = within(screen.getByRole('list', { name: /発動スキル/ })).getAllByRole(
      'listitem',
    )

    // assert: 発動スキルが 9 件列挙されている
    expect(listItems).toHaveLength(9)

    // assert: レベルの降順、 レベルが同じ場合はスキルID順に表示されている
    expect(listItems[0]).toHaveTextContent('攻撃Lv7')
    expect(listItems[1]).toHaveTextContent('見切りLv7')
    expect(listItems[2]).toHaveTextContent('挑戦者Lv5')
    expect(listItems[3]).toHaveTextContent('超会心Lv3')
    expect(listItems[4]).toHaveTextContent('弱点特効Lv3')
    expect(listItems[5]).toHaveTextContent('煽衛Lv2')
    expect(listItems[6]).toHaveTextContent('粉塵纏Lv2')
    expect(listItems[7]).toHaveTextContent('スタミナ急速回復Lv1')
    expect(listItems[8]).toHaveTextContent('巧撃Lv1')
  })

  it('スキルの合計値が最大レベルを超える場合は丸め込んで表示する', async () => {
    await render(BuildViewerComponent, {
      componentProperties: {
        build: {
          decorations: [
            {
              name: '攻撃珠【２】',
              type: 'decoration',
              slotSize: 2,
              skills: [['攻撃', 1]],
            },
          ],
          defense: 760,
          fireResistance: 11,
          waterResistance: -9,
          thunderResistance: 1,
          iceResistance: -8,
          dragonResistance: -4,
          leg: {
            series: 'インゴットＸ',
            name: 'インゴットＸグリーヴ',
            type: 'leg',
            defense: 136,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [1, 1],
            fireResistance: -1,
            waterResistance: -1,
            thunderResistance: 1,
            iceResistance: 0,
            dragonResistance: 0,
            skills: [
              ['攻撃', 2],
              ['見切り', 2],
            ],
            decorations: [],
          },
          arm: {
            series: '狗竜の革Ｘ',
            name: '狗竜の革篭手Ｘ',
            type: 'arm',
            defense: 140,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [1, 1],
            fireResistance: 0,
            waterResistance: 0,
            thunderResistance: 0,
            iceResistance: 1,
            dragonResistance: 0,
            skills: [['攻撃', 3]],
            decorations: [],
          },
          helm: {
            series: 'ハンターＸ',
            name: 'ハンターＸヘルム',
            type: 'helm',
            defense: 132,
            hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
            slots: [2],
            fireResistance: 0,
            waterResistance: 0,
            thunderResistance: 0,
            iceResistance: 0,
            dragonResistance: 0,
            skills: [
              ['アイテム使用強化', 1],
              ['攻撃', 2],
            ],
            decorations: [
              {
                name: '攻撃珠【２】',
                type: 'decoration',
                slotSize: 2,
                skills: [['攻撃', 1]],
              },
            ],
          },
          talisman: {
            name: '攻撃Lv3',
            type: 'talisman',
            slots: [],
            skills: [],
            decorations: [],
          },
        },
      },
    })

    // assert: 攻撃のスキルポイント合計は 8 だが、 最大値の 7 に丸め込まれている
    expect(
      within(screen.getByRole('list', { name: /発動スキル/ })).getAllByRole('listitem')[0],
    ).toHaveTextContent('攻撃Lv7')
  })
})
