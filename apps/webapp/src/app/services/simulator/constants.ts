import { Armor, armors } from '@ya-mhrs-sim/data'
import { Constraint, lessEq, greaterEq } from 'yalps'
import { Variable } from './types'

export const WEAPON_KEY = '武器'

export const BASE_ARMORS: ReadonlyMap<Armor['name'], Armor> = new Map(
  armors.map((armor) => [armor.name, armor]),
)

export const BASE_CONSTRAINTS: [keyof Variable, Constraint][] = [
  // 各部位一つだけ装備可能
  ['weapon', lessEq(1)],
  ['helm', lessEq(1)],
  ['chest', lessEq(1)],
  ['arm', lessEq(1)],
  ['waist', lessEq(1)],
  ['leg', lessEq(1)],
  ['talisman', lessEq(1)],

  // 空きスロット数を超過して装飾品はつけられない
  ['level1OrHigherSlot', greaterEq(0)],
  ['level2OrHigherSlot', greaterEq(0)],
  ['level3OrHigherSlot', greaterEq(0)],
  ['level4OrHigherSlot', greaterEq(0)],
]
