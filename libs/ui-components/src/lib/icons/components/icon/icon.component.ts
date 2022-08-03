import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core'
// import { invariant } from '../../../lib/asserts'

@Component({
  selector: 'uic-icon',
  templateUrl: './icon.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input()
  set name(name: string) {
    this.#name = name
  }
  get name() {
    if (!this.#name) {
      throw new Error('name must be required')
    }

    return this.#name
  }
  #name: string | undefined
}
