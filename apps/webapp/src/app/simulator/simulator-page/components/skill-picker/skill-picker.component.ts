import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'
import {
  COMPOSITION_BUFFER_MODE,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { Skill, SkillColor, skills } from '@ya-mhrs-sim/data'
import { SkillModel } from '~webapp/models'
import { SkillBadgeComponent } from '../skill-badge/skill-badge.component'
import { SkillInputComponent } from '../skill-input/skill-input.component'

@Component({
  standalone: true,
  selector: 'app-skill-picker',
  templateUrl: './skill-picker.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // IME 確定前の値を query に反映するための設定
  providers: [{ provide: COMPOSITION_BUFFER_MODE, useValue: false }],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiComponentsModule,
    SkillInputComponent,
    SkillBadgeComponent,
  ],
})
export class SkillPickerComponent {
  @Input()
  formGroup!: FormGroup<{
    [x in Skill['name']]: FormControl<number>
  }>

  colors = [
    { label: '絞り込みを解除', value: null }, // リセット用の項目
    { label: '赤色系スキル', value: SkillColor.Red },
    { label: '桃色系スキル', value: SkillColor.Pink },
    { label: '赤橙系スキル', value: SkillColor.NeonOrange },
    { label: '茶色系スキル', value: SkillColor.Brown },
    { label: '橙色系スキル', value: SkillColor.Orange },
    { label: '黄色系スキル', value: SkillColor.Yellow },
    { label: '黄緑色系スキル', value: SkillColor.Green },
    { label: '薄水色系スキル', value: SkillColor.PaleBlue },
    { label: '水色系スキル', value: SkillColor.Sky },
    { label: '青色系スキル', value: SkillColor.Blue },
    { label: '紫色系スキル', value: SkillColor.Violet },
    { label: '白色系スキル', value: SkillColor.White },
    { label: '灰色系スキル', value: SkillColor.Gray },
  ]

  query = this.fb.nonNullable.control('')

  selectedColor: SkillColor | null = null

  get filteredSkills(): Skill[] {
    const query = this.query.value.toLowerCase()

    return skills.filter((skill) => {
      const passThrough = true

      const result1 =
        query === ''
          ? passThrough
          : [skill.name, ...skill.keywords].some((keyword) => keyword.toLowerCase().includes(query))

      const result2 = this.selectedColor ? skill.color === this.selectedColor : passThrough

      return result1 && result2
    })
  }

  get selectedSkills(): { name: Skill['name']; level: number }[] {
    return Object.entries(this.formGroup.controls).reduce<{ name: Skill['name']; level: number }[]>(
      (skills, [name, control]) => {
        if (control.value === 0) return skills

        const skill = SkillModel.mustGet(name)

        return skills.concat({ name: skill.name, level: control.value })
      },
      [],
    )
  }

  constructor(private readonly fb: FormBuilder) {}

  resetQuery(): void {
    this.query.reset()
  }

  deselect(name: Skill['name']): void {
    const control = this.formGroup.controls[name]

    control.reset()
  }

  onClickColor(color: SkillColor | null) {
    this.selectedColor = this.selectedColor === color ? null : color
  }
}
