import { Inject, Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { DOCUMENT } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'
import { firstValueFrom, Subject, takeUntil } from 'rxjs'

/**
 * Service Worker の更新有無を確認するクラス
 * 更新がある場合はそれをユーザーに通知する
 */
@Injectable({
  providedIn: 'root',
})
export class LogUpdateService {
  #onDestroy = new Subject<void>()

  constructor(
    @Inject(DOCUMENT)
    private readonly doc: Document,
    private readonly swUpdate: SwUpdate,
    private readonly snackBar: MatSnackBar,
  ) {}

  watch() {
    this.swUpdate.versionUpdates.pipe(takeUntil(this.#onDestroy)).subscribe((event) => {
      switch (event.type) {
        case 'NO_NEW_VERSION_DETECTED': {
          this.#stop()

          return console.log('no update found')
        }

        case 'VERSION_DETECTED': {
          return console.log(`Downloading new app version: ${event.version.hash}`)
        }

        case 'VERSION_READY': {
          this.#stop()

          console.log(`Current app version: ${event.currentVersion.hash}`)

          const ref = this.snackBar.open('最新のバージョンが利用できます', '再読み込み', {
            horizontalPosition: 'right',
          })

          firstValueFrom(ref.onAction())
            .then(() => this.swUpdate.activateUpdate())
            .then(() => this.doc.location.reload())

          return console.log(`New app version ready for use: ${event.latestVersion.hash}`)
        }

        case 'VERSION_INSTALLATION_FAILED':
          this.#stop()

          return console.log(
            `Failed to install app version '${event.version.hash}': ${event.error}`,
          )
      }
    })
  }

  #stop() {
    this.#onDestroy.next()
    this.#onDestroy.complete()
  }
}
