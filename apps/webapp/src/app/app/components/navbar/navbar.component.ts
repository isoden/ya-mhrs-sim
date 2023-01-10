import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { LetModule } from '@ngrx/component'
import { filter, Observable, skip, Subject, takeUntil, withLatestFrom } from 'rxjs'
import { StoreService } from '~webapp/services/store.service'

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LetModule, UiComponentsModule],
})
export class AppNavbarComponent implements OnInit, OnDestroy {
  collapsed$?: Observable<boolean>

  #onDestroy = new Subject<void>()

  constructor(private readonly store: StoreService, private readonly router: Router) {}

  ngOnInit(): void {
    this.collapsed$ = this.store.select((state) => state.navCollapsed)

    const navigationEnd$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      skip(1),
    )

    // ページ遷移があったときに開いている場合は閉じる
    navigationEnd$
      .pipe(
        takeUntil(this.#onDestroy.asObservable()),
        withLatestFrom(this.collapsed$),
        filter(([, collapsed]) => !collapsed),
      )
      .subscribe(() => {
        this.store.update((state) => {
          state.navCollapsed = true
        })
      })
  }

  ngOnDestroy(): void {
    this.#onDestroy.next()
    this.#onDestroy.complete()
  }
}
