import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core'
import { match } from 'ts-pattern'

@Component({
  selector: 'uic-pretty-number',
  template: '{{ textContent }}',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrettyNumberComponent {
  @Input()
  set value(value: number) {
    this.#value = value
    this.#sign = Math.sign(value)
  }

  get value() {
    return this.#value
  }

  @Input()
  fallback = '-'

  #value = 0
  #sign = 0

  @HostBinding('class')
  get className() {
    return match(this.#sign)
      .with(1, () => ['text-green-500', 'dark:text-green-400'])
      .with(-1, () => ['text-red-500', 'dark:text-red-400'])
      .otherwise(() => [])
  }

  get textContent() {
    return match(this.#sign)
      .with(1, () => `+${this.value}`)
      .with(-1, () => `${this.value}`)
      .otherwise(() => this.fallback)
  }
}
