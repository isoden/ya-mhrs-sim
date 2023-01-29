import { Decoration } from './decoration'
import { decorations } from './decorations-json'

describe('Decoration', () => {
  it.each(decorations)('should be passed schema check $name', (decoration) => {
    // データの整合性チェック
    expect(() => Decoration.parse(decoration)).not.toThrow()
  })
})
