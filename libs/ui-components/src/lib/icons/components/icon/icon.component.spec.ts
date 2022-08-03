import { render } from '@testing-library/angular'

import { IconComponent } from './icon.component'
import { IconsModule } from '../../icons.module'

describe('IconComponent', () => {
  it('name を指定しなかった場合例外をスローする', async () => {
    expect(() =>
      render(IconComponent, {
        imports: [IconsModule],
      }),
    ).rejects.toThrow(/name must be required/)
  })
})
