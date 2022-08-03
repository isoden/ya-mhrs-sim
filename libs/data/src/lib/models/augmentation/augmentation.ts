import { z } from 'zod'
import { groupBy, zipWith } from 'lodash-es'
import { Armor } from '../armor'
import { Skill } from '../skill'

export const Augmentation = z.object({
  name: z.string(),
  defense: z.number().int(),
  fireResistance: z.number().int(),
  waterResistance: z.number().int(),
  thunderResistance: z.number().int(),
  iceResistance: z.number().int(),
  dragonResistance: z.number().int(),
  slots: z.array(z.number().int()).min(0).max(3),
  skills: z.array(z.tuple([Skill.shape.name, z.number().int()])),
})
export type Augmentation = z.infer<typeof Augmentation>

/**
 * 傀異錬成防具情報をマージした防具を作成する
 *
 * @param baseArmor -
 * @param augmentation -
 */
export function augmentArmor(baseArmor: Armor, augmentation: Augmentation): Armor {
  const {
    // 防具にすでについていてレベルの変更があったスキル
    modified = [],

    // 追加されたスキル
    added = [],
  } = groupBy(augmentation.skills, (skill) =>
    baseArmor.skills.some((baseSkill) => baseSkill[0] === skill[0]) ? 'modified' : 'added',
  )

  return {
    ...baseArmor,
    defense: baseArmor.defense + augmentation.defense,
    fireResistance: baseArmor.fireResistance + augmentation.fireResistance,
    waterResistance: baseArmor.waterResistance + augmentation.waterResistance,
    thunderResistance: baseArmor.thunderResistance + augmentation.thunderResistance,
    iceResistance: baseArmor.iceResistance + augmentation.iceResistance,
    dragonResistance: baseArmor.dragonResistance + augmentation.dragonResistance,
    slots: zipWith(baseArmor.slots, augmentation.slots, (a = 0, b = 0) => a + b).filter(
      (x) => x !== 0,
    ),
    skills: (modified.length === 0
      ? baseArmor.skills
      : baseArmor.skills
          .map<[Skill['name'], number]>(([name, level]) => {
            const match = modified.find(([nameToCompare]) => name === nameToCompare)

            if (match) {
              return [name, level + match[1]]
            }

            return [name, level]
          })
          // 傀異錬成でスキルレベルが 0 になったものを取り除く
          .filter(([, level]) => level > 0)
    ).concat(added),
    augmentation,
  }
}
