import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core'

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
    return {
      'font-semibold': ![1, -1].includes(this.#sign),
      'text-green-400': this.#sign === 1,
      'text-red-400': this.#sign === -1,
    }
  }

  get textContent() {
    switch (this.#sign) {
      case 1:
        return `+${this.value}`
      case -1:
        return `${this.value}`

      default:
        return this.fallback
    }
  }
}
