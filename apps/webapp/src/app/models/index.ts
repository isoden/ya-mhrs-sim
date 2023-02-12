import { Skill, SkillColor, skills } from '@ya-mhrs-sim/data'
import { mustGet } from '~webapp/functions/asserts'

export class SkillModel {
  /**
   * スキル名からスキルを取得する
   *
   * @param name - スキル名
   */
  public static get(name: string): Skill | undefined {
    return skills.find((skill) => skill.name === name)
  }

  /**
   * スキル名からスキルを取得する。取得できなかった場合は例外をスローする。
   *
   * @param name - スキル名
   */
  public static mustGet(name: string): Skill {
    return mustGet(this.get(name), `Expected name to be one of the skillNames, got ${name}`)
  }

  /**
   * SkillColor を `fill-#RRGGBB` のフォーマットに変換する
   * @param color - SkillColor
   */
  public static fill(color: SkillColor): string

  /**
   * スキル名を `fill-#RRGGBB` のフォーマットに変換する
   * @param name - スキル名
   */
  public static fill(name: string): string
  public static fill(nameOrColor: string | SkillColor): string {
    const color = typeof nameOrColor === 'string' ? this.mustGet(nameOrColor).color : nameOrColor

    switch (color) {
      case SkillColor.Green:
        return 'fill-[#26e196]'
      case SkillColor.Brown:
        return 'fill-[#9b784f]'
      case SkillColor.White:
        return 'fill-[#fff]'
      case SkillColor.Red:
        return 'fill-[#ff4b0d]'
      case SkillColor.Violet:
        return 'fill-[#a540e1]'
      case SkillColor.Gray:
        return 'fill-[#aeaeae]'
      case SkillColor.Blue:
        return 'fill-[#476eff]'
      case SkillColor.PaleBlue:
        return 'fill-[#a0cdff]'
      case SkillColor.Pink:
        return 'fill-[#ef73b9]'
      case SkillColor.Yellow:
        return 'fill-[#ffff71]'
      case SkillColor.Sky:
        return 'fill-[#5aaaff]'
      case SkillColor.Orange:
        return 'fill-[#ffb355]'
      case SkillColor.VividOrange:
        return 'fill-[#ff7316]'
    }
  }

  static toString(skills: [string, number][]): string {
    return skills.map(([name, level]) => `${name}Lv${level}`).join(',\n')
  }
}

export const WeaponSlots = [
  [],
  [1],
  [1, 1],
  [1, 1, 1],
  [2],
  [2, 1],
  [2, 1, 1],
  [2, 2],
  [2, 2, 1],
  [2, 2, 2],
  [3],
  [3, 1],
  [3, 1, 1],
  [3, 2],
  [3, 2, 1],
  [3, 2, 2],
  [3, 3],
  [3, 3, 1],
  [3, 3, 2],
  [3, 3, 3],
  [4],
  [4, 1],
  [4, 1, 1],
  [4, 2],
  [4, 2, 1],
  [4, 2, 2],
  [4, 3],
  [4, 3, 1],
  [4, 3, 2],
  [4, 3, 3],
  [4, 4],
  [4, 4, 1],
  [4, 4, 2],
  [4, 4, 3],
  [4, 4, 4],
]
