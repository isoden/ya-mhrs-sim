import { Injectable } from '@angular/core'
import { Skill, Talisman } from '@ya-mhrs-sim/data'
import { z } from 'zod'
import { SkillModel } from '~webapp/models'

const defaults = () => ['', '0', '', '0', '0', '0', '0']

/**
 * 護石情報のインポート/エクスポートを支援するクラス
 */
@Injectable({
  providedIn: 'root',
})
export class TalismansPortingService {
  /**
   * 護石情報を CSV 文字列からインポートする
   *
   * @param csv -
   */
  importFromCsv(csv: string): { value: Talisman[]; errors: string[] } {
    return csv.split('\n').reduce<{ value: Talisman[]; errors: string[] }>(
      (result, col, index) => {
        if (col === '') return result

        try {
          // 値の中に `,` が含まれないため、 単純に `split(',')` で各値を取り出す
          const rows = Object.assign(defaults(), col.split(','))

          const [name1, level1, name2, level2, ...slots] = Schema.parse(rows)

          const skills = (
            [
              [name1, level1],
              [name2, level2],
            ] as const
          ).reduce<Talisman['skills']>((skills, [name, level]) => {
            if (name === '') return skills

            return skills.concat([[name as Skill['name'], level]])
          }, [])

          result.value.push(
            Talisman.parse({
              name: SkillModel.toString(skills),
              skills,
              slots: slots.filter((x) => x > 0).sort((a, b) => b - a),
            }),
          )
        } catch (err) {
          // TODO: 詳細なエラー情報を表示する
          result.errors.push(`${index + 1}行目: 読み込みエラー`)
        }

        return result
      },
      { value: [], errors: [] },
    )
  }

  /**
   * 護石情報を CSV 文字列として出力する
   *
   * @param augmentations -
   */
  exportAsCsv(talismans: Talisman[]): string {
    return talismans
      .map((talisman) => {
        const skill = Object.assign(
          [
            ['', 0],
            ['', 0],
          ],
          talisman.skills,
        )
        const slot = Object.assign([0, 0, 0], talisman.slots).join(',')

        return `${skill},${slot}`
      })
      .join('\n')
  }
}

// CSV インポート時の行のスキーマ
const Schema = z
  .tuple([
    // スキル1: 必須
    Skill.shape.name,
    z.coerce.number().int().min(1),

    // スキル2: オプション
    Skill.shape.name.or(z.literal('')),
    z.coerce.number().int().min(0),

    // スロット
    z.coerce.number().int().min(0).max(4),
    z.coerce.number().int().min(0).max(4),
    z.coerce.number().int().min(0).max(4),
  ])
  .superRefine(([name1, level1, name2, level2], ctx) => {
    ;(
      [
        [name1, level1],
        [name2, level2],
      ] as const
    ).forEach(([name, level]) => {
      if (name === '') {
        return
      }

      const skill = SkillModel.mustGet(name)

      if (skill.max < level) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `expected level of ${name} to be less than or equal ${skill.max}, got ${level}`,
        })
      }
    })
  })
