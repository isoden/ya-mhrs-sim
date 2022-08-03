import { z } from 'zod'
import { Equipment, EquipmentType } from './equipment'

export const Weapon = Equipment.extend({
  type: z.literal(EquipmentType.enum.weapon).default(EquipmentType.enum.weapon),
})

export type Weapon = z.infer<typeof Weapon>
