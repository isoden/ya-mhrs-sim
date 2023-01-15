import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { StoreService } from '~webapp/services/store.service'
import { APP_VERSION } from '../../appVersion'

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UiComponentsModule],
})
export class AppHeaderComponent {
  readonly appVersion = inject(APP_VERSION)
  readonly #store = inject(StoreService)

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
