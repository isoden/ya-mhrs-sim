import { Injectable, OnDestroy } from '@angular/core'
import { Augmentation, Talisman } from '@ya-mhrs-sim/data'
import produce, { Draft } from 'immer'
import { BehaviorSubject, distinctUntilChanged, map, Observable, skip, Subscription } from 'rxjs'
import { LocalStorageService } from './local-storage.service'

type Schema = {
  mode: 'light' | 'dark'
  navCollapsed: boolean
  talismans: Talisman[]
  augmentations: Augmentation[]
}

@Injectable({
  providedIn: 'root',
})
export class StoreService extends BehaviorSubject<Schema> implements OnDestroy {
  readonly #subscriptions = new Subscription()

  constructor(localStorage: LocalStorageService<Webapp.LocalStorageSchema>) {
    super({
      mode: localStorage.get('mode', 'light'),
      navCollapsed: true,
      talismans: localStorage.get('talismans', []),
      augmentations: localStorage.get('augmentations', []),
    })

    // 永続化
    this.#subscriptions.add(
      this.select((state) => state.mode)
        .pipe(skip(1))
        .subscribe((mode) => localStorage.set('mode', mode)),
    )
    this.#subscriptions.add(
      this.select((state) => state.talismans)
        .pipe(skip(1))
        .subscribe((talismans) => localStorage.set('talismans', talismans)),
    )
    this.#subscriptions.add(
      this.select((state) => state.augmentations)
        .pipe(skip(1))
        .subscribe((augmentations) => localStorage.set('augmentations', augmentations)),
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
