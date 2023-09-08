import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
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
export class SkillPickerComponent implements OnInit {
  readonly #fb = inject(FormBuilder)

  @Input()
  formGroup!: FormGroup<{
    [x in Skill['name']]: FormControl<number>
  }>

  readonly colors = [
    { label: '絞り込みを解除', value: null }, // リセット用の項目
    { label: '赤色系スキル', value: SkillColor.Red },
    { label: '桃色系スキル', value: SkillColor.Pink },
    { label: '赤橙系スキル', value: SkillColor.VividOrange },
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

  readonly skills = skills

  readonly form = this.#fb.group({
    query: this.#fb.nonNullable.control(''),
    color: this.#fb.control<SkillColor | null>(null),
  })

  /**
   * hidden の場合に true を返すマップ
   */
  skillsVisibility: { [x in Skill['name']]?: boolean } = {}

  readonly #takeUntilDestroyed = takeUntilDestroyed()

  get isEmpty() {
    return Object.keys(this.skillsVisibility).length === skills.length
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

  ngOnInit(): void {
    this.form.valueChanges.pipe(this.#takeUntilDestroyed).subscribe(() => {
      const query = this.form.controls.query.value.toLowerCase()
      const color = this.form.controls.color.value

      this.skillsVisibility = skills.reduce<typeof this.skillsVisibility>((visibility, skill) => {
        const passThrough = true

        const result1 =
          query === ''
            ? passThrough
            : [skill.name, ...skill.keywords].some((keyword) =>
                keyword.toLowerCase().includes(query),
              )

        const result2 = color ? skill.color === color : passThrough

        if (!(result1 && result2)) {
          visibility[skill.name] = true
        }

        return visibility
      }, {})
    })
  }

  resetQuery(): void {
    this.form.controls.query.reset()
  }

  deselect(name: Skill['name']): void {
    this.formGroup.controls[name].reset()
  }

  onClickColor(color: SkillColor | null) {
    if (this.form.controls.color.value === color) {
      this.form.controls.color.reset()
    } else {
      this.form.controls.color.setValue(color)
    }
  }

  trackBy(index: number, item: Skill) {
    return item.name
  }
}
