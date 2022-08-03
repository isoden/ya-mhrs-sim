import { DOCUMENT } from '@angular/common'
import { inject } from '@angular/core'
import { fromEvent, map, Observable, of, startWith } from 'rxjs'

/**
 * matchMedia の結果を boolean で返すヘルパー
 *
 * @param defaults - window.matchMedia が無い環境で返される値
 */
export function useMatchMedia(defaults = false): (query: string) => boolean {
  const doc = inject(DOCUMENT)
  const matchMedia = doc.defaultView?.matchMedia // Server 環境だと defaultView (window) が存在する、 かつ matchMedia が存在しないケースがある

  if (!matchMedia) {
    return () => defaults
  }

  return (query) => matchMedia(query).matches
}

/**
 * matchMedia の結果を Observable<boolean> で返すヘルパー
 *
 * @param defaults - window.matchMedia が無い環境で返される値
 */
export function useMatchMediaObservable(defaults = false): (query: string) => Observable<boolean> {
  const doc = inject(DOCUMENT)
  const matchMedia = doc.defaultView?.matchMedia // Server 環境だと defaultView (window) が存在する、 かつ matchMedia が存在しないケースがある

  if (!matchMedia) {
    return () => of(defaults)
  }

  return (query) => {
    const mql = matchMedia(query)

    return fromEvent<MediaQueryListEvent>(mql, 'change').pipe(
      map((event) => event.matches),
      startWith(mql.matches),
    )
  }
}
