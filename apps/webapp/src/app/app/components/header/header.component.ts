import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { StoreService } from '../../../services/store.service'
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
  constructor(
    @Inject(APP_VERSION)
    public readonly appVersion: string,
    private readonly store: StoreService,
  ) {}

  toggleCollapse(): void {
    this.store.update((state) => {
      state.navCollapsed = !state.navCollapsed
    })
  }

  toggleMode(): void {
    this.store.update((draft) => {
      draft.mode = draft.mode === 'dark' ? 'light' : 'dark'
    })
  }
}
