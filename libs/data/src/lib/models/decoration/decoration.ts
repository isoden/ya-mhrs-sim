import { z } from 'zod'
import { Skill } from '../skill'

export const Decoration = z.object({
  /** 装飾品名 */
  name: z.string(),

  /** 防具種別 */
  type: z.literal('decoration'),

  /** 消費スロットサイズ */
  slotSize: z.number().int().min(0).max(4),

  /** スキル */
  skills: z.array(z.tuple([Skill.shape.name, z.number()])),
})
export type Decoration = z.infer<typeof Decoration>
