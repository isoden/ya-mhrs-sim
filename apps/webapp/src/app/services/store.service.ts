import { Injectable, OnDestroy } from '@angular/core'
import produce, { Draft } from 'immer'
import { BehaviorSubject, distinctUntilChanged, map, Observable, skip, Subscription } from 'rxjs'
import { LocalStorageService } from './local-storage.service'

type Schema = {
  mode: 'light' | 'dark'
  navCollapsed: boolean
}

@Injectable({
  providedIn: 'root',
})
export class StoreService extends BehaviorSubject<Schema> implements OnDestroy {
  #subscriptions = new Subscription()

  constructor(localStorage: LocalStorageService<Webapp.LocalStorageSchema>) {
    super({
      mode: localStorage.get('mode', 'light'),
      navCollapsed: true,
    })

    // 永続化
    this.#subscriptions.add(
      this.select((state) => state.mode)
        .pipe(skip(1))
        .subscribe((mode) => localStorage.set('mode', mode)),
    )
  }

  ngOnDestroy(): void {
    this.#subscriptions.unsubscribe()
  }

  select<T>(selector: (state: Schema) => T): Observable<T> {
    return this.pipe(map(selector), distinctUntilChanged())
  }

  update(producer: (draft: Draft<Schema>) => void): void {
    super.next(produce(super.value, producer))
  }
}
