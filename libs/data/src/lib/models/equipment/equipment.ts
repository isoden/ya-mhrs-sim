import { z } from 'zod'
import { Augmentation } from '../augmentation'
import { Skill } from '../skill'

/** 装備品種別 */
export const EquipmentType = z.enum([
  'weapon',
  'helm',
  'chest',
  'arm',
  'waist',
  'leg',
  'talisman',
  'decoration',
])
export type EquipmentType = z.infer<typeof EquipmentType>

export const Equipment = z.object({
  /** 装備品名 */
  name: z.string().min(1),

  /** 装備品種別 */
  type: EquipmentType,

  /** 空きスロット */
  slots: z
    .array(z.number().int().min(1).max(4))
    .min(0)
    .max(3)
    .default(() => []),

  /** 発動スキル */
  skills: z.array(z.tuple([Skill.shape.name, z.number().int().min(1)])).default(() => []),

  /** 傀異錬成情報 */
  augmentation: Augmentation.optional(),
})
export type Equipment = z.infer<typeof Equipment>
