import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { LetDirective } from '@ngrx/component'
import { StoreService } from '~webapp/services/store.service'
import { AuthService } from '~webapp/services/auth/auth.service'
import { UsersService } from '~webapp/services/users/users.service'

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, UiComponentsModule, LetDirective, CdkMenuTrigger, CdkMenu, CdkMenuItem],
})
export class AppHeaderComponent {
  readonly #store = inject(StoreService)
  readonly #auth = inject(AuthService)
  readonly #users = inject(UsersService)

  readonly user$ = this.#users.currentUser$
  readonly expanded$ = this.#store.select((state) => !state.navCollapsed)

  constructor() {
    this.#auth.authStateChanged$.pipe(takeUntilDestroyed()).subscribe(async (user) => {
      if (!user) return

      await this.#users.signUp(user)
    })
  }

  async signIn(): Promise<void> {
    await this.#auth.signIn()
  }

  async signOut(): Promise<void> {
    await this.#auth.signOut()
  }

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
