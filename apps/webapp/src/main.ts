import { enableProdMode } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app/components/app/app.component'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

function bootstrap() {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err))
}

if (document.readyState === 'complete') {
  bootstrap()
} else {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
}
