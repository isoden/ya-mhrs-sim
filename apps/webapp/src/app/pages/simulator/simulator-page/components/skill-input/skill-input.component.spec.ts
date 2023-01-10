import { render } from '~webapp/test-utils'
import { skills } from '@ya-mhrs-sim/data'

import { SkillInputComponent } from './skill-input.component'

describe('SkillInputComponent', () => {
  it('should render', async () => {
    await render(SkillInputComponent, {
      componentProperties: {
        skill: skills[0],
      },
    })

    expect(true).toBeTruthy()
  })
})
