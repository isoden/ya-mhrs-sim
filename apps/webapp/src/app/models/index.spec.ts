import { SkillModel } from './index'

describe('SkillModel', () => {
  describe('get', () => {
    it('名前が一致するスキルを返す', () => {
      expect(SkillModel.get('攻撃')).toBeTruthy()
    })

    it('名前が一致しない場合 undefined を返す', () => {
      expect(SkillModel.get('こうげき')).toBeUndefined()
    })
  })

  describe('mustGet', () => {
    it('名前が一致するスキルを返す', () => {
      expect(SkillModel.mustGet('攻撃')).toBeTruthy()
    })

    it('名前が一致しない場合例外をスローする', () => {
      expect(() => SkillModel.mustGet('こうげき')).toThrow(/got こうげき/)
    })
  })

  describe('toString', () => {
    it('スキルをフォーマットして返す', () => {
      expect(SkillModel.toString([['攻撃', 4]])).toBe('攻撃Lv4')
      expect(
        SkillModel.toString([
          ['攻撃', 4],
          ['弱点特効', 3],
        ]),
      ).toBe('攻撃Lv4,\n弱点特効Lv3')
    })
  })
})
