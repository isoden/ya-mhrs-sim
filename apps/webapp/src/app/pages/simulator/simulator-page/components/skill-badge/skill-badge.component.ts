import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'
import { SkillColor } from '@ya-mhrs-sim/data'
import { invariant } from '../../../../../functions/asserts'

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
    invariant(this.#color, 'color must be required')

    return this.#color
  }
  set color(color: SkillColor) {
    this.#color = color
  }
  #color?: SkillColor

  @Input()
  get shape(): Shape {
    invariant(this.#shape, 'shape must be required')

    return this.#shape
  }
  set shape(shape: Shape) {
    this.#shape = shape
  }
  #shape?: Shape

  get className() {
    return {
      'text-green-400': this.color === SkillColor.Green,
      'text-yellow-900': this.color === SkillColor.Brown,
      'text-white': this.color === SkillColor.White,
      'text-red-600': this.color === SkillColor.Red,
      'text-violet-900': this.color === SkillColor.Violet,
      'text-gray-500': this.color === SkillColor.Gray,
      'text-blue-700': this.color === SkillColor.Blue,
      'text-sky-200': this.color === SkillColor.PaleBlue,
      'text-pink-500': this.color === SkillColor.Pink,
      'text-yellow-300': this.color === SkillColor.Yellow,
      'text-sky-500': this.color === SkillColor.Sky,
      'text-orange-400': this.color === SkillColor.Orange,
      'text-orange-600': this.color === SkillColor.NeonOrange,
      'stroke-gray-300': this.color === SkillColor.White,
      'stroke-1': this.color === SkillColor.White,
    }
  }
}
