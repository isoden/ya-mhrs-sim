import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { LetDirective } from '@ngrx/component'
import { filter, skip, withLatestFrom } from 'rxjs'
import { StoreService } from '~webapp/services/store.service'

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LetDirective, UiComponentsModule],
})
export class AppNavbarComponent implements OnInit {
  readonly #store = inject(StoreService)
  readonly #router = inject(Router)
  readonly #takeUntilDestroyed = takeUntilDestroyed()

  readonly collapsed$ = this.#store.select((state) => state.navCollapsed)

  ngOnInit(): void {
    const navigationEnd$ = this.#router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      skip(1),
    )

    // ページ遷移があったときに開いている場合は閉じる
    navigationEnd$
      .pipe(
        this.#takeUntilDestroyed,
        withLatestFrom(this.collapsed$),
        filter(([, collapsed]) => !collapsed),
      )
      .subscribe(() => {
        this.#store.update((state) => {
          state.navCollapsed = true
        })
      })
  }
}
