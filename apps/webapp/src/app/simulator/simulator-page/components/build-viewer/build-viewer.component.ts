import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { Skill, SkillNames } from '@ya-mhrs-sim/data'
import { uniq } from 'lodash-es'
import { SkillModel } from '~webapp/models'
import { invariant } from '~webapp/functions/asserts'
import { Build } from '~webapp/services/simulator.service'

@Component({
  standalone: true,
  selector: 'app-build-viewer',
  templateUrl: './build-viewer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UiComponentsModule],
})
export class BuildViewerComponent {
  @Input()
  set build(build: Build) {
    this.#build = build
  }
  get build(): Build {
    invariant(this.#build, 'build must be required')

    return this.#build
  }

  #build: Build | undefined

  rows = ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'talisman'] as const

  /**
   * ビルドに含まれるスキルを集計する
   *
   * @param build
   */
  aggregateSkill(build: Build): {
    /** スキル名 */
    name: string
    /** スキルの合計値 */
    total: number
  }[] {
    const equipments = [
      build.weapon,
      build.helm,
      build.chest,
      build.arm,
      build.waist,
      build.leg,
      build.talisman,
    ].filter((x): x is NonNullable<typeof x> => typeof x !== 'undefined')

    const names = uniq(
      equipments
        .flatMap((equipment) => equipment.skills.map(([name]) => name))
        .concat(build.decorations.flatMap((decoration) => decoration.skills.map(([name]) => name))),
    )

    const init = names.reduce<{ [x: string]: number }>((init, name) => ({ ...init, [name]: 0 }), {})

    const points = equipments.reduce((skills, equipment) => {
      ;[
        ...equipment.skills,
        ...equipment.decorations.flatMap((decoration) => decoration.skills),
      ].forEach(([name, level]) => {
        skills[name] += level
      })

      return skills
    }, init)

    return (
      Object.entries(points)
        // スキル表示順のソート
        .sort(
          mergeCompare(
            // 1. スキルレベルが高い順
            ([, a], [, b]) => b - a,
            // 2. ゲーム内でのスキル順
            ([a], [b]) =>
              SkillNames.options.indexOf(a as Skill['name']) -
              SkillNames.options.indexOf(b as Skill['name']),
          ),
        )
        .map(([name, total]) => ({ name, total: Math.min(total, SkillModel.mustGet(name).max) }))
    )
  }
}

/**
 * 複数のソート比較関数をマージする
 * ソート関数は左から順に 0 以外の値を返すまで繰り返し実行される
 *
 * @param compares - 比較関数
 */
const mergeCompare =
  <T>(...compares: ((a: T, b: T) => number)[]) =>
  (a: T, b: T): number =>
    compares.reduce((result, compare) => (result === 0 ? compare(a, b) : result), 0)
