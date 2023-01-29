import { Armor } from './armor'
import { armors } from './armors-json'

describe('Armor', () => {
  // データの整合性チェック
  it.each(armors)('should be passed schema check $name', (armor) => {
    expect(() => Armor.parse(armor)).not.toThrow()
  })
})
