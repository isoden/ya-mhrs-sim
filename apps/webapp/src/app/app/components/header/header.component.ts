import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { StoreService } from '~webapp/services/store.service'

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UiComponentsModule],
})
export class AppHeaderComponent {
  readonly #store = inject(StoreService)
  readonly expanded$ = this.#store.select((state) => !state.navCollapsed)

  toggleCollapse(): void {
    this.#store.update((state) => {
      state.navCollapsed = !state.navCollapsed
    })
  }

  toggleMode(): void {
    this.#store.update((draft) => {
      draft.mode = draft.mode === 'dark' ? 'light' : 'dark'
    })
  }
}
