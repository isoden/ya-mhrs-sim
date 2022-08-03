import { render } from '@testing-library/angular'
import { FormBuilder, FormControl } from '@angular/forms'
import { Skill, skills } from '@ya-mhrs-sim/data'

import { SkillPickerComponent } from './skill-picker.component'

describe('SkillPickerComponent', () => {
  it('should render', async () => {
    const fb = new FormBuilder()

    const group = fb.nonNullable.group(
      skills.reduce(
        (group, skill) => ({ ...group, [skill.name]: fb.nonNullable.control(0) }),
        {} as { [x in Skill['name']]: FormControl<number> },
      ),
    )

    await render(SkillPickerComponent, {
      componentProperties: {
        formGroup: group,
      },
    })

    expect(true).toBeTruthy()
  })
})
