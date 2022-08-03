import { z } from 'zod'
import { Equipment, EquipmentType } from '../equipment'

export const Armor = Equipment.extend({
  /** 防具シリーズ名 */
  series: z.string(),

  /** 防具種別 */
  type: z.enum([
    EquipmentType.enum.helm,
    EquipmentType.enum.chest,
    EquipmentType.enum.arm,
    EquipmentType.enum.waist,
    EquipmentType.enum.leg,
  ]),

  /** 最終強化後の防御力 */
  defense: z.number().int(),

  kind: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),

  /** 火耐性 */
  fireResistance: z.number().int(),

  /** 水耐性 */
  waterResistance: z.number().int(),

  /** 雷耐性 */
  thunderResistance: z.number().int(),

  /** 氷耐性 */
  iceResistance: z.number().int(),

  /** 龍耐性 */
  dragonResistance: z.number().int(),
})
export type Armor = z.infer<typeof Armor>
