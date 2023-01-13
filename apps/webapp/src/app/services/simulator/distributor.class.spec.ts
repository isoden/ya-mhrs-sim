import { Decoration } from '@ya-mhrs-sim/data'
import { Distributor } from './distributor.class'

describe('Distributor', () => {
  const wirebugJewel4: Decoration = {
    name: '翔蟲珠Ⅱ【４】',
    type: 'decoration',
    slotSize: 4,
    skills: [['翔蟲使い', 2]],
  }
  const redirectionJewel3: Decoration = {
    name: '合気珠【３】',
    type: 'decoration',
    slotSize: 3,
    skills: [['合気', 1]],
  }
  const attackJewel2: Decoration = {
    name: '攻撃珠【２】',
    type: 'decoration',
    slotSize: 2,
    skills: [['攻撃', 1]],
  }
  const ironshellJewel1: Decoration = {
    name: '鋼殻珠【１】',
    type: 'decoration',
    slotSize: 1,
    skills: [['鋼殻の恩恵', 1]],
  }

  const cases: { items: { slotSizes: number[]; expected: Decoration[] }[] }[] = [
    {
      items: [
        {
          slotSizes: [4, 4, 4, 4],
          expected: [wirebugJewel4, redirectionJewel3, redirectionJewel3, attackJewel2],
        },
        {
          slotSizes: [4, 4, 4, 4],
          expected: [attackJewel2, attackJewel2, attackJewel2, attackJewel2],
        },
        {
          slotSizes: [4, 4, 4, 4],
          expected: [ironshellJewel1, ironshellJewel1, ironshellJewel1],
        },
      ],
    },
    {
      items: [
        {
          slotSizes: [3, 1],
          expected: [redirectionJewel3, ironshellJewel1],
        },
        {
          slotSizes: [2, 1, 1],
          expected: [attackJewel2, ironshellJewel1, ironshellJewel1],
        },
        {
          slotSizes: [4, 4, 3, 3],
          expected: [wirebugJewel4, redirectionJewel3, attackJewel2, attackJewel2],
        },
        {
          slotSizes: [4, 2, 1],
          expected: [attackJewel2, attackJewel2],
        },
      ],
    },
  ]

  it.each(cases)('空きスロットに効率的に珠を分配する %#', ({ items }) => {
    const distributor = new Distributor([
      wirebugJewel4,
      redirectionJewel3,
      redirectionJewel3,
      attackJewel2,
      attackJewel2,
      attackJewel2,
      attackJewel2,
      attackJewel2,
      ironshellJewel1,
      ironshellJewel1,
      ironshellJewel1,
    ])

    items.forEach(({ slotSizes, expected }) => {
      expect(distributor.distribute(slotSizes)).toEqual(expected)
    })

    // assert: 分配終了後は何も返さない
    expect(distributor.distribute([4, 3, 2, 1])).toEqual([])
  })
})
