import { enableProdMode, importProvidersFrom } from '@angular/core'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { ServiceWorkerModule } from '@angular/service-worker'
import { APP_VERSION_PROVIDER } from './app/app/appVersion'
import { AppComponent } from './app/app/components/app/app.component'
import { routes } from './app/app/routes'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

function bootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      importProvidersFrom(
        BrowserAnimationsModule, // TODO: provideAnimation() で良いはずだけど standalone + lazy loading の場合はエラーになった
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000',
        }),
        MatSnackBarModule,
      ),
      APP_VERSION_PROVIDER,
    ],
  }).catch((err) => console.error(err))
}

if (document.readyState === 'complete') {
  bootstrap()
} else {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
}
