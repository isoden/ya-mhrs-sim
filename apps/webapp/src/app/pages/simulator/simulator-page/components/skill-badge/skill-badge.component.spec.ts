import { render, screen } from '@testing-library/angular'
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
