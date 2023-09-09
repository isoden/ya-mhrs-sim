import { Armor, Weapon, Decoration, Talisman, decorations } from '@ya-mhrs-sim/data'
import { groupBy, times, constant, zip } from 'lodash-es'
import { mustGet } from '~webapp/functions/asserts'
import { WEAPON_KEY } from './constants'
import { Distributor } from './distributor.class'
import { SimulateParams } from './simulator.service'
import { Variable, Build } from './types'

declare global {
  interface Array<T> {
    toSpliced(start: number, deleteCount?: number): T[]
    toSpliced(start: number, deleteCount: number, ...items: T[]): T[]
  }
}

export function armorToVariable(armor: Armor): Variable {
  const { type, skills, slots, defense } = armor

  return {
    ...Object.fromEntries(skills),
    ...createArmorSlots(slots),
    defense,
    [type]: 1,
  }
}

export function createArmorSlots(slots: number[]) {
  return {
    level1OrHigherSlot: slots.filter((slot) => slot >= 1).length,
    level2OrHigherSlot: slots.filter((slot) => slot >= 2).length,
    level3OrHigherSlot: slots.filter((slot) => slot >= 3).length,
    level4OrHigherSlot: slots.filter((slot) => slot >= 4).length,
  }
}

export function createDecorationSlots(slotSize: number) {
  return {
    level1OrHigherSlot: slotSize >= 1 ? -1 : 0,
    level2OrHigherSlot: slotSize >= 2 ? -1 : 0,
    level3OrHigherSlot: slotSize >= 3 ? -1 : 0,
    level4OrHigherSlot: slotSize >= 4 ? -1 : 0,
  }
}

export function createBuild(
  equipments: ReadonlyMap<string, Weapon | Armor | Decoration | Talisman>,
  variables: [string, number][],
): Build {
  const {
    weapon = [],
    armors = [],
    talisman = [],
    decorations = [],
  } = groupBy(
    variables.flatMap(([variableKey, amount]) =>
      times(
        amount,
        constant(
          mustGet(
            equipments.get(variableKey),
            `Unexpected variableKey excepted. (variableKey = ${variableKey})`,
          ),
        ),
      ),
    ),
    (equipment) =>
      equipment.type === 'decoration'
        ? 'decorations'
        : equipment.type === 'weapon'
        ? 'weapon'
        : equipment.type === 'talisman'
        ? 'talisman'
        : 'armors',
  ) as {
    weapon?: Weapon[]
    armors?: Armor[]
    talisman?: Talisman[]
    decorations?: Decoration[]
  }

  const distributor = new Distributor(decorations)

  return [...weapon, ...armors, ...talisman].reduce<Build>(
    (build, equipment) => {
      const decorations = distributor.distribute(equipment.slots)

      if (equipment.type === 'weapon') {
        build[equipment.type] = { ...equipment, decorations }
        return build
      } else if (equipment.type === 'talisman') {
        build[equipment.type] = { ...equipment, decorations }
        return build
      }

      build[equipment.type] = { ...equipment, decorations }

      build.defense += equipment.defense
      build.fireResistance += equipment.fireResistance
      build.waterResistance += equipment.waterResistance
      build.thunderResistance += equipment.thunderResistance
      build.iceResistance += equipment.iceResistance
      build.dragonResistance += equipment.dragonResistance

      return build
    },
    {
      decorations,
      defense: 0,
      fireResistance: 0,
      waterResistance: 0,
      thunderResistance: 0,
      iceResistance: 0,
      dragonResistance: 0,
    },
  )
}
export function createWeapon(slots: number[]): Weapon {
  return {
    name: WEAPON_KEY,
    type: 'weapon',
    slots,
    skills: [],
  }
}

export function addWeaponVariable(variables: Map<string, Variable>, slots: number[]): void {
  variables.set(WEAPON_KEY, {
    weapon: 1,
    ...createArmorSlots(slots),
  })
}

export function addDecorationsVariable(
  variables: Map<string, Variable>,
  includedSkills: [string, number][],
  excludedSkills: SimulateParams['excludedSkills'],
): ReadonlyMap<string, Decoration> {
  const decorationsMap = new Map<string, Decoration>()
  const includedSkillNames = includedSkills.map(([name]) => name)

  decorations.forEach((decoration) => {
    const skillNames = decoration.skills.map(([name]) => name)

    if (
      !skillNames.some((skillName) => excludedSkills.includes(skillName)) &&
      skillNames.some((skillName) => includedSkillNames.includes(skillName))
    ) {
      const { skills, slotSize, type } = decoration

      decorationsMap.set(decoration.name, decoration)

      variables.set(decoration.name, {
        ...Object.fromEntries(skills),
        ...createDecorationSlots(slotSize),
        [type]: 1,
      })
    }
  })

  return decorationsMap
}

export function addTalismansVariable(
  variables: Map<string, Variable>,
  talismans: Talisman[],
  includedSkills: SimulateParams['includedSkills'],
): ReadonlyMap<string, Talisman> {
  const talismansMap = new Map<string, Talisman>()
  // スロット効率が最大のもの
  const safelist = findLargestSlots(talismans).map(
    (slots) => mustGet(talismans.find((talisman) => shallowEqualArray(talisman.slots, slots))).name,
  )

  talismans.forEach((talisman) => {
    if (
      safelist.includes(talisman.name) ||
      talisman.skills.some(([name]) => includedSkills[name] > 0)
    ) {
      variables.set(talisman.name, {
        talisman: 1,
        ...createArmorSlots(talisman.slots),
        ...Object.fromEntries(talisman.skills),
      })

      talismansMap.set(talisman.name, talisman)
    }
  })

  return talismansMap
}

export function excludesSmallerSlots<Item extends { slots: number[] }>(array: Item[]): Item[] {
  const slotsList = findLargestSlots(array)

  return array.filter((item) => slotsList.some((slots) => shallowEqualArray(item.slots, slots)))
}

export function groupByType(armors: Armor[]): Armor[][] {
  const { helm, chest, arm, waist, leg } = groupBy(armors, (armor) => armor.type)

  return [helm, chest, arm, waist, leg]
}

function findLargestSlots<Item extends { slots: number[] }>(array: Item[]): number[][] {
  return array
    .map((item) => item.slots)
    .filter((a, index, array) => array.findIndex((b) => shallowEqualArray(a, b)) === index)
    .reduce<number[][]>(
      (result, a, index, slotsList) =>
        slotsList
          .toSpliced(index, 1)
          .some((slotSizes) => zip(a, slotSizes).every(([a = 0, b = 0]) => a <= b))
          ? result
          : result.concat([a]),
      [],
    )
}

function shallowEqualArray<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((a, i) => a === b[i])
}
