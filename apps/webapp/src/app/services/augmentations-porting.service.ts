import { Injectable } from '@angular/core'
import { Augmentation, Skill } from '@ya-mhrs-sim/data'
import { chunk } from 'lodash-es'
import { z } from 'zod'

const defaults = () => [
  '',
  '0',
  '0',
  '0',
  '0',
  '0',
  '0',
  '0',
  '0',
  '0',
  '',
  '0',
  '',
  '0',
  '',
  '0',
  '',
  '0',
  '',
  '0',
]

/**
 * 傀異錬成防具の強化情報のインポート/エクスポートを支援するクラス
 */
@Injectable({
  providedIn: 'root',
})
export class AugmentationsPortingService {
  /**
   * 強化情報を CSV 文字列からインポートする
   *
   * @param csv -
   */
  importFromCsv(csv: string): { value: Augmentation[]; errors: string[] } {
    return csv.split('\n').reduce<{ value: Augmentation[]; errors: string[] }>(
      (result, col, index) => {
        if (col === '') return result

        try {
          // 値の中に `,` が含まれないため、 単純に `split(',')` で各値を取り出す
          const rows = Object.assign(defaults(), col.split(','))

          const [
            name,
            defense,
            fireResistance,
            waterResistance,
            thunderResistance,
            iceResistance,
            dragonResistance,
            slot1,
            slot2,
            slot3,
            ...skills
          ] = Schema.parse(rows)

          result.value.push({
            name,
            defense,
            fireResistance,
            waterResistance,
            thunderResistance,
            iceResistance,
            dragonResistance,
            slots: [slot1, slot2, slot3],
            skills: (chunk(skills, 2) as [Schema[10], number][])
              .filter(([name]) => name !== '')
              .map<[Skill['name'], number]>(([name, level]) => [name as Skill['name'], level]),
          })
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
   * 強化情報を CSV 文字列として出力する
   *
   * @param augmentations -
   */
  exportAsCsv(augmentations: Augmentation[]): string {
    return augmentations
      .map(
        ({
          name,
          defense,
          fireResistance,
          waterResistance,
          thunderResistance,
          iceResistance,
          dragonResistance,
          slots,
          skills,
        }) => {
          const skill = Object.assign(
            [
              ['', ''],
              ['', ''],
              ['', ''],
              ['', ''],
              ['', ''],
            ],
            skills,
          ).join(',')

          // prettier-ignore
          return `${name},${defense},${fireResistance},${waterResistance},${thunderResistance},${iceResistance},${dragonResistance},${slots.join(',')},${skill}`
        },
      )
      .join('\n')
  }
}

// CSV インポート時の行のスキーマ
const Schema = z.tuple([
  // 防具名
  z.string().min(1),

  // 防御力
  z.coerce.number().int(),

  // 火属性耐性値
  z.coerce.number().int(),

  // 水属性耐性値
  z.coerce.number().int(),

  // 雷属性耐性値
  z.coerce.number().int(),

  // 氷属性耐性値
  z.coerce.number().int(),

  // 龍属性耐性値
  z.coerce.number().int(),

  // スロット
  z.coerce.number().int(),
  z.coerce.number().int(),
  z.coerce.number().int(),

  // スキル1: オプション
  Skill.shape.name.or(z.literal('')),
  z.coerce.number().int(),

  // スキル2: オプション
  Skill.shape.name.or(z.literal('')),
  z.coerce.number().int(),

  // スキル3: オプション
  Skill.shape.name.or(z.literal('')),
  z.coerce.number().int(),

  // スキル4: オプション
  Skill.shape.name.or(z.literal('')),
  z.coerce.number().int(),

  // スキル5: オプション
  Skill.shape.name.or(z.literal('')),
  z.coerce.number().int(),
])
type Schema = z.infer<typeof Schema>
