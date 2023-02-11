import { Armor } from '../armor'
import { HunterTypes } from '../equipment'
import { Skill } from '../skill'
import { augmentArmor, AugmentationStatus } from './augmentation-status'

describe('AugmentationStatus', () => {
  describe('augmentArmor', () => {
    // baseArmor の slots は 0 がない。 augmentationStatus のスロットは 0 がある。
    it.each([
      [[4], [0, 2, 0], [4, 2]],
      [[0, 0, 0], [0, 0, 0], []],
      [
        [1, 1, 1],
        [1, 1, 1],
        [2, 2, 2],
      ],
    ])('スロットのマージ %j + %j = %j', (slots, augmentedSlots, expected) => {
      expect(
        augmentArmor(baseArmor({ slots }), createAugmentationStatus({ slots: augmentedSlots })),
      ).toMatchObject({
        slots: expected,
      })
    })

    it.each<[[Skill['name'], number][], [Skill['name'], number][], [Skill['name'], number][]]>([
      // レベルが加算される
      [[['翔蟲使い', 2]], [['翔蟲使い', 1]], [['翔蟲使い', 3]]],

      // 0 になったものは省かれる
      [[['翔蟲使い', 1]], [['翔蟲使い', -1]], []],

      // スキルが増える
      [
        [['翔蟲使い', 1]],
        [['攻撃', 1]],
        [
          ['翔蟲使い', 1],
          ['攻撃', 1],
        ],
      ],
    ])('スキルのマージ %j + %j = %j', (skills, augmentedSkills, expected) => {
      expect(
        augmentArmor(baseArmor({ skills }), createAugmentationStatus({ skills: augmentedSkills })),
      ).toMatchObject({
        skills: expected,
      })
    })
  })
})

function baseArmor(field: Partial<Armor> = {}): Armor {
  return {
    series: 'カムラノ装・継',
    name: 'カムラノ装【頭巾】継',
    type: 'helm',
    defense: 130,
    hunterTypes: [HunterTypes.Type01, HunterTypes.Type02],
    slots: [2],
    fireResistance: 2,
    waterResistance: 0,
    thunderResistance: 0,
    iceResistance: 0,
    dragonResistance: 0,
    skills: [
      ['精霊の加護', 2],
      ['死中に活', 1],
    ],
    ...field,
  }
}

function createAugmentationStatus(field: Partial<AugmentationStatus> = {}): AugmentationStatus {
  return {
    name: 'カムラノ装【頭巾】継',
    defense: 0,
    fireResistance: 0,
    waterResistance: 0,
    thunderResistance: 0,
    iceResistance: 0,
    dragonResistance: 0,
    slots: [],
    skills: [],
    ...field,
  }
}
