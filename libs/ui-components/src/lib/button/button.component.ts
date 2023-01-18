import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core'
import { match } from 'ts-pattern'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[uic-button], a[uic-button]',
  template: '<ng-content />',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @HostBinding('class')
  get className() {
    const baseClass = [
      'rounded',
      'border',
      'border-pink-600',
      'bg-pink-600',
      'px-5',
      'text-white',
      'transition',
      'hover:bg-pink-700',
      'focus:outline-none',
      'focus:ring',
    ]

    const sizeClass = match(this.size)
      .with('sm', () => ['py-1', 'text-sm'])
      .with('md', () => ['py-1.5'])
      .with('lg', () => [])
      .exhaustive()

    return [...baseClass, ...sizeClass]
  }

  @Input()
  size: 'sm' | 'md' | 'lg' = 'md'
}
