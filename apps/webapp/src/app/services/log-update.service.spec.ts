import { TestBed } from '@angular/core/testing'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ServiceWorkerModule } from '@angular/service-worker'

import { LogUpdateService } from './log-update.service'

describe('LogUpdateService', () => {
  let service: LogUpdateService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        ServiceWorkerModule.register('/ngsw-register.js', {
          enabled: false,
        }),
      ],
    })
    service = TestBed.inject(LogUpdateService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
