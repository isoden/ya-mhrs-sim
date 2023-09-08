import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ServiceWorkerModule } from '@angular/service-worker'
import { routes } from './app/routes'
import { environment } from '../environments/environment'
import { firebaseProviders } from './providers/firebase'

export const appConfig: ApplicationConfig = {
  providers: [
    firebaseProviders,
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
  ],
}
