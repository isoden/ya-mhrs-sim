import { inject, Injectable } from '@angular/core'
import { augmentArmor, Talisman, Weapon, Armor, Decoration, Skill, armors } from '@ya-mhrs-sim/data'
import { Constraint, greaterEq, lessEq } from 'yalps'
import { firstValueFrom, map, shareReplay } from 'rxjs'
import { wrap } from 'comlink'
import mem from 'mem'
import { mustGet } from '~webapp/functions/asserts'
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
  createBuild,
  excludesSmallerSlots,
  groupByType,
} from './functions'
import { LoggerService } from '../logger.service'

export { SimulateParams, SimulationResult, Build } from './types'

/**
 * 検索条件に一致するビルドを検索するクラス
 */
@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  readonly #store = inject(StoreService)
  readonly #logger = inject(LoggerService)

  #worker?: Worker

  readonly #talismans$ = this.#store.select((state) => state.talismans).pipe(shareReplay(1))
  readonly #augmentedArmors$ = this.#store
    .select((state) => state.augmentationStatuses)
    .pipe(
      map((augmentationStatuses) =>
        augmentationStatuses.map((augmentationStatus) =>
          augmentArmor(
            mustGet(BASE_ARMORS.get(augmentationStatus.name), `${augmentationStatus.name}`),
            augmentationStatus,
          ),
        ),
      ),
      shareReplay(1),
    )

  readonly #memoizedSimulate = mem(
    async ({
      includedSkills: baseIncludedSkills,
      excludedSkills,
      hunterType,
      weaponSlots,
      talismans,
      augmentedArmors,
    }: SimulateParams & {
      talismans: Talisman[]
      augmentedArmors: Armor[]
    }): Promise<SimulationResult> => {
      const includedSkills = (
        Object.entries(baseIncludedSkills) as [Skill['name'], number][]
      ).filter(([, level]) => level > 0)

      const constraints = new Map<string, Constraint>(
        BASE_CONSTRAINTS.concat(
          // スキルの制約を追加
          includedSkills.map(([name, level]) => [name, greaterEq(level)]),
          excludedSkills.map((name) => [name, lessEq(0)]),
        ),
      )

      const variables = new Map<string, Variable>()

      groupByType(
        armors.filter((armor) => !armor.skills.some(([name]) => excludedSkills.includes(name))),
      ).forEach((armors) => {
        // スロット効率が最大のもの
        const safelist = excludesSmallerSlots(armors).map((it) => it.name)

        armors.forEach((armor) => {
          if (
            armor.hunterTypes.includes(hunterType) &&
            (safelist.includes(armor.name) ||
              armor.skills.some(([name]) => baseIncludedSkills[name] > 0))
          ) {
            variables.set(armor.name, armorToVariable(armor))
          }
        })
      })

      const talismansMap = addTalismansVariable(variables, talismans, baseIncludedSkills)
      const decorationsMap = addDecorationsVariable(variables, includedSkills, excludedSkills)
      const augmentedArmorsList = groupByType(
        augmentedArmors.filter(
          (armor) => !armor.skills.some(([name]) => excludedSkills.includes(name)),
        ),
      )

      augmentedArmorsList.forEach((armors, i) => {
        // スロット効率が最大のもの
        const safelist = excludesSmallerSlots(armors).map((it) => it.name)

        armors.forEach((armor, j) => {
          if (
            safelist.includes(armor.name) ||
            armor.skills.some(([name]) => baseIncludedSkills[name] > 0)
          ) {
            variables.set(armor.name + `[${i}.${j}]`, armorToVariable(armor))
          }
        })
      })

      this.#logger.log('[solver] variables', Array.from(variables))
      this.#logger.log('[solver] constraints', Array.from(constraints))

      const equipments = new Map<string, Weapon | Armor | Decoration | Talisman>([
        ...BASE_ARMORS,
        ...decorationsMap,
        ...talismansMap,
        ...augmentedArmorsList.flatMap((armors, i) =>
          armors.map<[string, Armor]>((it, j) => [it.name + `[${i}.${j}]`, it]),
        ),
      ])

      if (weaponSlots.length > 0) {
        addWeaponVariable(variables, weaponSlots)
        equipments.set(WEAPON_KEY, createWeapon(weaponSlots))
      }

      const solve =
        typeof globalThis.Worker !== 'undefined'
          ? wrap<typeof import('../../workers/lp-solver.worker').api>(this.#configureWorker()).solve
          : (await import('../../workers/lp-solver.worker').then((m) => m.api)).solve

      const solution = await this.#measure(() =>
        solve({
          direction: 'maximize',
          objective: 'defense',
          constraints,
          variables,
          integers: true,
        }),
      )

      this.#logger.log('[solver] solution', solution)

      if (solution.status !== 'optimal') {
        return {
          type: 'failed',
          status: solution.status,
        }
      }

      const builds = [createBuild(equipments, solution.variables)]

      this.#logger.log('[solver] builds', builds[0])

      return {
        type: 'succeeded',
        builds,
      }
    },
    { cacheKey: JSON.stringify },
  )

  /**
   * 検索条件に一致するビルドを検索する
   *
   * @param params - 検索条件
   */
  async simulate(params: SimulateParams): Promise<SimulationResult> {
    const [talismans, augmentedArmors] = await Promise.all([
      firstValueFrom(this.#talismans$),
      firstValueFrom(this.#augmentedArmors$),
    ])

    return this.#memoizedSimulate({ ...params, talismans, augmentedArmors })
  }

  #configureWorker(): Worker {
    this.#worker?.terminate()

    return (this.#worker = workerFactory())
  }

  async #measure<T>(func: () => T | PromiseLike<T>): Promise<T> {
    const label = `[measurement] solver`

    this.#logger.time(label)

    const value = await func()

    this.#logger.timeEnd(label)

    return value
  }
}
