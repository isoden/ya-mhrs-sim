import { z } from 'zod'
import { Equipment, EquipmentType } from './equipment'

export const Talisman = Equipment.extend({
  type: z.literal(EquipmentType.enum.talisman).default(EquipmentType.enum.talisman),
})
export type Talisman = z.infer<typeof Talisman>
