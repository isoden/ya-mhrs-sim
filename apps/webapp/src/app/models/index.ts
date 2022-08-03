import { Skill, skills } from '@ya-mhrs-sim/data'
import { invariant } from '../functions/asserts'

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
    const skill = this.get(name)

    invariant(skill, `Expected name to be one of the skillNames, got ${name}`)

    return skill
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

export type HunterType = 'type01' | 'type02'
