import { Directive, HostBinding, Input } from '@angular/core'
import { match } from 'ts-pattern'

@Directive({
  selector: '[uicPrettyNumber]',
})
export class PrettyNumberDirective {
  @Input()
  set uicPrettyNumber(value: number) {
    this.#sign = Math.sign(value)
  }

  #sign = 0

  @HostBinding('class')
  get className() {
    return match(this.#sign)
      .with(1, () => ['text-green-500', 'dark:text-green-400'])
      .with(-1, () => ['text-red-500', 'dark:text-red-400'])
      .otherwise(() => [])
  }
}
