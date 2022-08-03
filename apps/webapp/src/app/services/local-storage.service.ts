import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'

/**
 * LocalStorage の Wrapper クラス
 */
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService<Schema extends Record<string, unknown>> {
  readonly #storage?: Storage

  constructor(@Inject(DOCUMENT) doc: Document) {
    this.#storage = doc.defaultView?.localStorage
  }

  get<Key extends Extract<keyof Schema, string>, Value extends Schema[Key]>(
    key: Key,
  ): Value | undefined
  get<
    Key extends Extract<keyof Schema, string>,
    Value extends Schema[Key],
    DefaultValue extends Value,
  >(key: Key, defaultValue: DefaultValue): Value
  get<
    Key extends Extract<keyof Schema, string>,
    Value extends Schema[Key],
    DefaultValue extends Schema[Key],
  >(key: Key, defaultValue?: DefaultValue): Value | undefined {
    const item = this.#storage?.getItem(key)

    return item == null ? defaultValue : JSON.parse(item)
  }

  set<Key extends Extract<keyof Schema, string>, Value extends Schema[Key]>(
    key: Key,
    value: Value,
  ): void {
    this.#storage?.setItem(key, JSON.stringify(value))
  }
}
