import { TestBed } from '@angular/core/testing'
import { Talisman } from '@ya-mhrs-sim/data'
import { TalismansPortingService } from './talismans-porting.service'

describe('TalismansPortingService', () => {
  let service: TalismansPortingService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TalismansPortingService],
    })
    service = TestBed.inject(TalismansPortingService)
  })

  describe('importFromCsv', () => {
    describe('正常系', () => {
      it.each<[csv: string, expected: unknown]>([
        ['攻撃,1', Talisman.parse({ name: '攻撃Lv1', skills: [['攻撃', 1]], slots: [] })],
        ['攻撃,7', Talisman.parse({ name: '攻撃Lv7', skills: [['攻撃', 7]], slots: [] })],
        [
          '攻撃,1,見切り,1',
          Talisman.parse({
            name: '攻撃Lv1,\n見切りLv1',
            skills: [
              ['攻撃', 1],
              ['見切り', 1],
            ],
            slots: [],
          }),
        ],
        ['攻撃,7,,,1', Talisman.parse({ name: '攻撃Lv7', skills: [['攻撃', 7]], slots: [1] })],
        ['攻撃,7,,,1,1', Talisman.parse({ name: '攻撃Lv7', skills: [['攻撃', 7]], slots: [1, 1] })],
        [
          '攻撃,7,,,1,1,1',
          Talisman.parse({ name: '攻撃Lv7', skills: [['攻撃', 7]], slots: [1, 1, 1] }),
        ],
      ])('%j => %j', (csv, expected) => {
        expect(service.importFromCsv(csv)).toEqual({
          value: [expected],
          errors: [],
        })
      })
    })

    describe('異常系', () => {
      it.each([
        ['レベル上限超え', '攻撃,8'],
        ['スキル名間違い', 'こうげき,1'],
        ['スキル数間違い', '攻撃,1,弱点特効,1,超会心,1'],
        ['スロットサイズ上限超え', '攻撃,1,弱点特効,1,5'],
        ['スロット数上限超え', '攻撃,1,弱点特効,1,超会心,1,1,1,1'],
      ])('%s: %j', (_, csv) => {
        expect(service.importFromCsv(csv)).toEqual({
          value: [],
          errors: ['1行目: 読み込みエラー'],
        })
      })
    })
  })
})
