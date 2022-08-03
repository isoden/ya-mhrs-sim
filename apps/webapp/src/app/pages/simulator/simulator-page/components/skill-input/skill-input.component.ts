import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
} from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Skill } from '@ya-mhrs-sim/data'
import { range } from 'lodash-es'
import { invariant } from '../../../../../functions/asserts'
import { SkillBadgeComponent } from '../skill-badge/skill-badge.component'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NgCallback = any

@Component({
  standalone: true,
  selector: 'app-skill-input',
  templateUrl: './skill-input.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkillInputComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, FormsModule, SkillBadgeComponent],
})
export class SkillInputComponent implements ControlValueAccessor {
  @Input()
  get skill(): Skill {
    invariant(this.#skill, `skill must be required`)

    return this.#skill
  }
  set skill(skill: Skill) {
    this.#setSkill(skill)
    this.#skill = skill
  }
  #skill: Skill | undefined

  /** 現在のレベル */
  currentLevel = 0

  /** レベルの選択肢 */
  choices: number[] = []

  onChange?: (value: unknown) => void
  onTouch?: () => void

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  /**
   *
   * @param level
   */
  onClick(level: number): void {
    // 選択中のレベルがクリックされたときはレベルを 0 にして選択を解除する
    this.currentLevel = this.currentLevel === level ? 0 : level
    this.onChange?.(this.currentLevel)
  }

  #setSkill(skill: Skill): void {
    this.currentLevel = 0
    this.choices = range(skill.max + 1)
  }

  registerOnChange(fn: NgCallback): void {
    this.onChange = fn
  }

  registerOnTouched(fn: NgCallback): void {
    this.onTouch = fn
  }

  writeValue(obj: NgCallback): void {
    this.currentLevel = obj
    this.cdRef.markForCheck()
  }

  select(event: Event) {
    this.onClick(Number((event.target as HTMLSelectElement).value))
  }
}
