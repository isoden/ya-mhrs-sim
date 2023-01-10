import { render, screen } from '~webapp/test-utils'
import { SkillColor } from '@ya-mhrs-sim/data'

import { SkillBadgeComponent } from './skill-badge.component'

describe('SkillBadgeComponent', () => {
  it('should render', async () => {
    await render(SkillBadgeComponent, {
      componentProperties: {
        color: SkillColor.Pink,
        shape: 'diamond',
      },
    })

    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
