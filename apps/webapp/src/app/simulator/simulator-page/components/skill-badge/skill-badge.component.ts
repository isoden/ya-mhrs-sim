import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'
import { SkillColor } from '@ya-mhrs-sim/data'
import { mustGet } from '~webapp/functions/asserts'
import { SkillModel } from '~webapp/models'

type Shape = 'diamond' | 'circle'

@Component({
  standalone: true,
  selector: 'app-skill-badge',
  templateUrl: './skill-badge.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SkillBadgeComponent {
  SkillColor = SkillColor

  @Input()
  get color(): SkillColor {
    return mustGet(this.#color, 'color must be required')
  }
  set color(color: SkillColor) {
    this.#color = color
  }
  #color?: SkillColor

  @Input()
  get shape(): Shape {
    return mustGet(this.#shape, 'shape must be required')
  }
  set shape(shape: Shape) {
    this.#shape = shape
  }
  #shape?: Shape

  get className() {
    return {
      [SkillModel.fill(this.color)]: true,
      'stroke-gray-300': this.color === SkillColor.White,
      'stroke-1': this.color === SkillColor.White,
    }
  }
}
