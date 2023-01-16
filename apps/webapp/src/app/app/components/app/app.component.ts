import { DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { NavigationEnd, Router, RouterModule } from '@angular/router'
import { filter, skip } from 'rxjs'
import { invariant } from '~webapp/functions/asserts'
import { LogUpdateService } from '~webapp/services/log-update.service'
import { StoreService } from '~webapp/services/store.service'
import { AppHeaderComponent } from '../header/header.component'
import { AppNavbarComponent } from '../navbar/navbar.component'

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, AppHeaderComponent, AppNavbarComponent],
})
export class AppComponent implements OnInit {
  readonly #logUpdateService = inject(LogUpdateService)
  readonly #store = inject(StoreService)
  readonly #router = inject(Router)
  readonly #doc = inject(DOCUMENT)

  ngOnInit(): void {
    // https://angular.io/guide/accessibility#routing
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1), // 初期表示のときはフォーカスを動かさない
      )
      .subscribe(() => {
        const mainContents = this.#doc.getElementById('main-contents')

        invariant(mainContents)

        mainContents.focus({ preventScroll: true })
      })

    this.#store
      .select((state) => state.mode)
      .subscribe((mode) => this.#doc.documentElement.classList.toggle('dark', mode === 'dark'))

    this.#logUpdateService.watch()
  }
}
