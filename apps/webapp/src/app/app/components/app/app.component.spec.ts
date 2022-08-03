import { render } from '@testing-library/angular'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ServiceWorkerModule } from '@angular/service-worker'
import { APP_VERSION_PROVIDER } from '../../appVersion'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  it('should render', async () => {
    await render(AppComponent, {
      imports: [
        ServiceWorkerModule.register('/ngsw-script.js', { enabled: false }),
        MatSnackBarModule,
      ],
      providers: [APP_VERSION_PROVIDER],
    })

    expect(true).toBeTruthy()
  })
})
