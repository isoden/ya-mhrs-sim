import { Injectable } from '@angular/core'
import { augmentArmor, Talisman, Weapon, Armor, Decoration, Skill } from '@ya-mhrs-sim/data'
import { Constraint, greaterEq, lessEq } from 'yalps'
import { firstValueFrom, map, shareReplay } from 'rxjs'
import { wrap } from 'comlink'
import { invariant } from '~webapp/functions/asserts'
import { StoreService } from '~webapp/services/store.service'
import { workerFactory } from './worker.factory'
import { SimulateParams, SimulationResult, Variable } from './types'
import { BASE_ARMORS, BASE_CONSTRAINTS, WEAPON_KEY } from './constants'
import {
  armorToVariable,
  addTalismansVariable,
  addDecorationsVariable,
  addWeaponVariable,
  createWeapon,
  measure,
  createBuild,
} from './functions'

export { SimulateParams, SimulationResult, Build } from './types'

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
          const baseArmor = BASE_ARMORS.get(augmentation.name)

          invariant(baseArmor, `${augmentation.name}`)

          return augmentArmor(baseArmor, augmentation)
        }),
      ),
      shareReplay(1),
    )

  constructor(private readonly store: StoreService) {}

  async simulate({
    includedSkills: baseIncludedSkills,
    excludedSkills,
    hunterType,
    weaponSlots,
  }: SimulateParams): Promise<SimulationResult> {
    const includedSkills = (Object.entries(baseIncludedSkills) as [Skill['name'], number][]).filter(
      ([, level]) => level > 0,
    )

    const constraints = new Map<string, Constraint>(
      BASE_CONSTRAINTS.concat(
        // スキルの制約を追加
        includedSkills.map(([name, level]) => [name, greaterEq(level)]),
        excludedSkills.map((name) => [name, lessEq(0)]),
      ),
    )

    const variables = new Map<string, Variable>(
      Array.from(BASE_ARMORS).reduce<[string, Variable][]>(
        (variables, [key, armor]) =>
          armor.hunterTypes.includes(hunterType)
            ? variables.concat([[key, armorToVariable(armor)]])
            : variables,
        [],
      ),
    )

    const [talismans, augmentedArmors] = await Promise.all([
      firstValueFrom(this.#talismans$),
      firstValueFrom(this.#augmentedArmors$),
    ])

    const talismansMap = addTalismansVariable(variables, talismans)
    const decorationsMap = addDecorationsVariable(variables, includedSkills, excludedSkills)

    augmentedArmors.forEach((armor, i) =>
      variables.set(armor.name + `[${i}]`, armorToVariable(armor)),
    )

    console.log('[solver] variables', Array.from(variables))
    console.log('[solver] constraints', Array.from(constraints))

    const equipments = new Map<string, Weapon | Armor | Decoration | Talisman>([
      ...BASE_ARMORS,
      ...decorationsMap,
      ...talismansMap,
      ...augmentedArmors.map<[string, Armor]>((a, i) => [a.name + `[${i}]`, a]),
    ])

    if (weaponSlots.length > 0) {
      addWeaponVariable(variables, weaponSlots)
      equipments.set(WEAPON_KEY, createWeapon(weaponSlots))
    }

    const solve =
      typeof globalThis.Worker !== 'undefined'
        ? wrap<typeof import('../../workers/lp-solver.worker').api>(workerFactory()).solve
        : (await import('../../workers/lp-solver.worker').then((m) => m.api)).solve

    const solution = await measure(
      () =>
        solve({
          direction: 'maximize',
          objective: 'defense',
          constraints,
          variables,
          integers: true,
        }),
      { enabled: true, label: 'solver' },
    )

    console.log('[solver] solution', solution)

    if (solution.status !== 'optimal') {
      return {
        type: 'failed',
        status: solution.status,
      }
    }

    const builds = [createBuild(equipments, solution.variables)]

    console.log('[solver] builds', builds[0])

    return {
      type: 'succeeded',
      builds,
    }
  }
}
