import { TestBed } from '@angular/core/testing'
import { AugmentationStatus } from '@ya-mhrs-sim/data'
import { AugmentationStatusesPortingService } from './augmentation-statuses-porting.service'

describe('AugmentationsPortingService', () => {
  let service: AugmentationStatusesPortingService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AugmentationStatusesPortingService],
    })
    service = TestBed.inject(AugmentationStatusesPortingService)
  })

  describe('importFromCsv', () => {
    const name = 'リバルクシャナアンク'

    describe('正常系', () => {
      it.each<[csv: string, expected: Partial<AugmentationStatus>]>([
        [`${name},,,,,,`, { name }],
        [
          `${name},5,2,1,0,-1,-2`,
          {
            name,
            defense: 5,
            fireResistance: 2,
            waterResistance: 1,
            thunderResistance: 0,
            iceResistance: -1,
            dragonResistance: -2,
          },
        ],
        [`${name},,,,,,,1,,`, { name, slots: [1, 0, 0] }],
        [`${name},,,,,,,1,1,1`, { name, slots: [1, 1, 1] }],
        [`${name},,,,,,,,,1`, { name, slots: [0, 0, 1] }],
        [`${name},,,,,,,2,,1`, { name, slots: [2, 0, 1] }],

        [`${name},,,,,,,,,,攻撃,-1`, { name, skills: [['攻撃', -1]] }],
        [
          `${name},,,,,,,,,,攻撃,-1,弱点特効,-2`,
          {
            name,
            skills: [
              ['攻撃', -1],
              ['弱点特効', -2],
            ],
          },
        ],
        [
          `${name},,,,,,,,,,攻撃,-1,弱点特効,-2,超会心,1`,
          {
            name,
            skills: [
              ['攻撃', -1],
              ['弱点特効', -2],
              ['超会心', 1],
            ],
          },
        ],
        [
          `${name},,,,,,,,,,攻撃,-1,弱点特効,-2,超会心,1,見切り,2`,
          {
            name,
            skills: [
              ['攻撃', -1],
              ['弱点特効', -2],
              ['超会心', 1],
              ['見切り', 2],
            ],
          },
        ],
        [
          `${name},,,,,,,,,,攻撃,-1,弱点特効,-2,超会心,1,見切り,2,匠,3`,
          {
            name,
            skills: [
              ['攻撃', -1],
              ['弱点特効', -2],
              ['超会心', 1],
              ['見切り', 2],
              ['匠', 3],
            ],
          },
        ],
      ])('%j => %j', (csv, expected) => {
        expect(service.importFromCsv(csv)).toEqual({
          value: [
            {
              name: '',
              defense: 0,
              fireResistance: 0,
              waterResistance: 0,
              thunderResistance: 0,
              iceResistance: 0,
              dragonResistance: 0,
              slots: [0, 0, 0],
              skills: [],
              ...expected,
            },
          ],
          errors: [],
        })
      })
    })

    describe('異常系', () => {
      it.each([
        [
          'スキル数上限超え',
          `${name},,,,,,,,,,攻撃,-1,弱点特効,-2,超会心,1,見切り,2,匠,3,挑戦者,4`,
        ],
      ])('%s %j', (_, csv) => {
        expect(service.importFromCsv(csv)).toEqual({
          value: [],
          errors: ['1行目: 読み込みエラー'],
        })
      })
    })
  })
})
