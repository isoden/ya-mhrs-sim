import { Injectable } from '@angular/core'
import {
  KindState,
  augmentArmor,
  Skill,
  Talisman,
  EquipmentType,
  Weapon,
  armors,
  decorations,
  Armor,
  Decoration,
} from '@ya-mhrs-sim/data'
import { Constraint, solve, greaterEq, lessEq, SolutionStatus } from 'yalps'
import { times, constant, groupBy, fromPairs } from 'lodash-es'
import { Simplify } from 'type-fest'
import { firstValueFrom, map, shareReplay } from 'rxjs'
import { invariant } from '~webapp/functions/asserts'
import { StoreService } from './store.service'
import { Distributor } from './simulator/distributor.class'

// TODO: コンポーネントからの依存をやめる
import { FormValue } from '../simulator/simulator-page/components/simulator-page/simulator-page.component'

type Variable = Partial<
  Record<
    | EquipmentType
    | Skill['name']
    | 'defense'
    | 'onlyType01'
    | 'onlyType02'
    | 'level1OrHigherSlot'
    | 'level2OrHigherSlot'
    | 'level3OrHigherSlot'
    | 'level4OrHigherSlot',
    number
  >
>

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

type Failed = {
  type: 'failed'
  status: Exclude<SolutionStatus, 'optimal'>
}

type Succeeded = {
  type: 'succeeded'
  builds: Build[]
}

export type SimulationResult = Failed | Succeeded

const baseArmors: ReadonlyMap<Armor['name'], Armor> = new Map(
  armors.map((armor) => [armor.name, armor]),
)

const baseVariables: ReadonlyMap<string, Variable> = new Map(
  Array.from(baseArmors).map<[string, Variable]>(([key, armor]) => [key, armorToVariable(armor)]),
)

function armorToVariable(armor: Armor): Variable {
  const { type, skills, slots, kind, defense } = armor

  return {
    ...asVariable(skills),
    ...createArmorSlots(slots),
    defense,
    onlyType01: kind === KindState.Type01 ? 1 : 0,
    onlyType02: kind === KindState.Type02 ? 1 : 0,
    [type]: 1,
  }
}

function createArmorSlots(slots: number[]) {
  return {
    level1OrHigherSlot: slots.filter((slot) => slot >= 1).length,
    level2OrHigherSlot: slots.filter((slot) => slot >= 2).length,
    level3OrHigherSlot: slots.filter((slot) => slot >= 3).length,
    level4OrHigherSlot: slots.filter((slot) => slot >= 4).length,
  }
}

function createDecorationSlots(slotSize: number) {
  return {
    level1OrHigherSlot: slotSize >= 1 ? -1 : 0,
    level2OrHigherSlot: slotSize >= 2 ? -1 : 0,
    level3OrHigherSlot: slotSize >= 3 ? -1 : 0,
    level4OrHigherSlot: slotSize >= 4 ? -1 : 0,
  }
}

const baseConstraints: [string, Constraint][] = [
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

const WEAPON_KEY = '武器'

/**
 * 検索条件に一致するビルドを検索するクラス
 */
@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  #talismans$ = this.store.select((state) => state.talismans).pipe(shareReplay(1))

  #augmentedArmors$ = this.store
    .select((state) => state.augmentations)
    .pipe(
      map((augmentations) =>
        augmentations.map((augmentation) => {
          const baseArmor = baseArmors.get(augmentation.name)

          invariant(baseArmor, `${augmentation.name}`)

          return augmentArmor(baseArmor, augmentation)
        }),
      ),
      shareReplay(1),
    )

  constructor(private readonly store: StoreService) {}

  async solve(formValue: FormValue): Promise<SimulationResult> {
    const includedSkills = Object.entries(formValue.includedSkills).filter(([, level]) => level > 0)
    const excludedSkills = Object.entries(formValue.excludedSkills).filter(
      ([, excluded]) => excluded,
    )

    const constraints = new Map<string, Constraint>(
      baseConstraints.concat(
        // スキルの制約を追加
        includedSkills.map(([name, level]) => [name, greaterEq(level)]),
        excludedSkills.map(([name]) => [name, lessEq(0)]),

        // タイプ違いの防具を除外
        [[formValue.hunterType === 'type01' ? 'onlyType02' : 'onlyType01', lessEq(0)]],
      ),
    )

    const variables = new Map<string, Variable>(baseVariables)

    const [talismans, augmentedArmors] = await Promise.all([
      firstValueFrom(this.#talismans$),
      firstValueFrom(this.#augmentedArmors$),
    ])

    const talismansMap = this.addTalismansVariable(variables, talismans)
    const decorationsMap = this.addDecorationsVariable(variables, includedSkills, excludedSkills)

    augmentedArmors.forEach((armor, i) => {
      variables.set(armor.name + `[${i}]`, armorToVariable(armor))
    })

    console.log('[solver] variables', Array.from(variables))
    console.log('[solver] constraints', Array.from(constraints))

    // eslint-disable-next-line no-restricted-syntax
    console.time('solver')

    const equipments = new Map<string, Weapon | Armor | Decoration | Talisman>([
      ...baseArmors,
      ...decorationsMap,
      ...talismansMap,
      ...augmentedArmors.map<[string, Armor]>((a, i) => [a.name + `[${i}]`, a]),
    ])

    if (formValue.weaponSlots.length > 0) {
      this.addWeaponVariable(variables, formValue.weaponSlots)
      equipments.set(WEAPON_KEY, this.createWeapon(formValue.weaponSlots))
    }

    /**
     * TODO: 最大化する項目を選べるようにする。 `defense` だけでなく空きスロットや火属性耐性値などを選択するイメージ。
     * TODO: 指定する条件によって時間がかかるため、 処理を Worker に分ける。
     *
     * @see {@link https://angular.io/guide/web-worker}
     * @see {@link https://www.npmjs.com/package/promise-worker}
     */
    const solution = solve({
      direction: 'maximize',
      objective: 'defense',
      constraints,
      variables,
      integers: true,
    })

    // eslint-disable-next-line no-restricted-syntax
    console.timeEnd('solver')
    console.log('[solver] solution', solution)

    if (solution.status !== 'optimal') {
      return {
        type: 'failed',
        status: solution.status,
      }
    }

    const builds = [this.createBuild(equipments, solution.variables)]

    console.log('[solver] builds', builds[0])

    return {
      type: 'succeeded',
      builds,
    }
  }

  private createBuild(
    equipments: ReadonlyMap<string, Weapon | Armor | Decoration | Talisman>,
    variables: [string, number][],
  ): Build {
    const {
      weapon = [],
      armors = [],
      talisman = [],
      decorations = [],
    } = groupBy(
      variables.flatMap(([variableKey, amount]) => {
        const equipment = equipments.get(variableKey)

        invariant(equipment, `Unexpected variableKey excepted. (variableKey = ${variableKey})`)

        return times(amount, constant(equipment))
      }),
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
        if (equipment.type === 'weapon') {
          build.weapon = {
            ...equipment,
            decorations: distributor.distribute(equipment.slots),
          }

          return build
        } else if (equipment.type === 'talisman') {
          build.talisman = {
            ...equipment,
            name: equipment.name, // talisman.name は getter で定義されておりスプレッドで渡すとフィールドが消えるため明示する
            decorations: distributor.distribute(equipment.slots),
          }

          return build
        }

        build[equipment.type] = {
          ...equipment,
          decorations: distributor.distribute(equipment.slots),
        }

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

  private createWeapon(slots: number[]): Weapon {
    return {
      name: WEAPON_KEY,
      type: 'weapon',
      slots,
      skills: [],
    }
  }

  private addWeaponVariable(variables: Map<string, Variable>, slots: number[]): void {
    variables.set(WEAPON_KEY, {
      weapon: 1,
      ...createArmorSlots(slots),
      ...asVariable([]), // TODO: 型的にスキル指定が1つ以上必要になっている。なくしたい。
    })
  }

  private addDecorationsVariable(
    variables: Map<string, Variable>,
    includedSkills: [string, number][],
    excludedSkills: [string, boolean][],
  ): ReadonlyMap<string, Decoration> {
    const decorationsMap = new Map<string, Decoration>()
    const includedSkillNames = includedSkills.map(([name]) => name)
    const excludedSkillNames = excludedSkills.map(([name]) => name)

    decorations.forEach((decoration) => {
      const skillNames = decoration.skills.map(([name]) => name)

      if (
        !skillNames.some((skillName) => excludedSkillNames.includes(skillName)) &&
        skillNames.some((skillName) => includedSkillNames.includes(skillName))
      ) {
        const { skills, slotSize, type } = decoration

        decorationsMap.set(decoration.name, decoration)

        variables.set(decoration.name, {
          ...asVariable(skills),
          ...createDecorationSlots(slotSize),
          [type]: 1,
        })
      }
    })

    return decorationsMap
  }

  private addTalismansVariable(
    variables: Map<string, Variable>,
    talismans: Talisman[],
  ): ReadonlyMap<string, Talisman> {
    const talismansMap: ReadonlyMap<string, Talisman> = new Map(
      talismans.map((talisman) => [talisman.name, talisman]),
    )

    talismansMap.forEach((talisman) => {
      variables.set(talisman.name, {
        talisman: 1,
        ...createArmorSlots(talisman.slots),
        ...asVariable(talisman.skills),
      })
    })

    return talismansMap
  }
}

function asVariable(skills: [string, number][]): Record<Skill['name'], number> {
  return fromPairs(skills) as Record<Skill['name'], number>
}
