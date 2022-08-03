import { InjectionToken, Provider } from '@angular/core'
import packageJson from '../../../../../package.json'

export const APP_VERSION = new InjectionToken<string>('APP_VERSION')

export const APP_VERSION_PROVIDER: Provider = {
  provide: APP_VERSION,
  useValue: packageJson?.version, // TODO: テスト環境だと `packageJson` が undefined になるため一時的に Optional chaining でアクセス
}
