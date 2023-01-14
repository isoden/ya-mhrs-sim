import {
  EquipmentType,
  HunterTypes,
  Skill,
  Decoration,
  Weapon,
  Armor,
  Talisman,
} from '@ya-mhrs-sim/data'
import { Simplify } from 'type-fest'
import { SolutionStatus } from 'yalps'

export type SimulateParams = {
  /** 必要なスキルとレベルのマップ */
  includedSkills: Record<Skill['name'], number>

  /** 除外するスキルをbooleanで指定するマップ */
  excludedSkills: Skill['name'][]

  /** ハンタータイプ */
  hunterType: HunterTypes

  /** 武器の空きスロット */
  weaponSlots: number[]
}

export type Variable = {
  [K in
    | EquipmentType
    | Skill['name']
    | 'defense'
    | 'level1OrHigherSlot'
    | 'level2OrHigherSlot'
    | 'level3OrHigherSlot'
    | 'level4OrHigherSlot']?: number
}

type WithDecorations<T> = Simplify<T & { decorations: Decoration[] }>

export type Build = {
  weapon?: WithDecorations<Weapon>
  helm?: WithDecorations<Armor>
  chest?: WithDecorations<Armor>
  arm?: WithDecorations<Armor>
  waist?: WithDecorations<Armor>
  leg?: WithDecorations<Armor>
  talisman?: WithDecorations<Talisman>
  decorations: Decoration[]
  defense: number
  fireResistance: number
  waterResistance: number
  thunderResistance: number
  iceResistance: number
  dragonResistance: number
}

export type SimulationResult =
  | {
      type: 'failed'
      status: Exclude<SolutionStatus, 'optimal'>
    }
  | {
      type: 'succeeded'
      builds: Build[]
    }
