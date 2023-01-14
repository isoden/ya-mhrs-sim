import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { LocalStorageService } from './local-storage.service'

type LogParams = Parameters<Console['log']>

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  get logEnabled(): boolean {
    return !environment.production || this.localStorage.get('debug') === 'on'
  }

  constructor(private readonly localStorage: LocalStorageService<Webapp.LocalStorageSchema>) {}

  log(...messages: LogParams): void {
    this.logEnabled && console.log(...messages)
  }

  warn(...messages: LogParams): void {
    this.logEnabled && console.warn(...messages)
  }

  error(...messages: LogParams): void {
    this.logEnabled && console.error(...messages)
  }

  time(label?: string): void {
    // eslint-disable-next-line no-restricted-syntax
    this.logEnabled && console.time(label)
  }

  timeEnd(label?: string): void {
    // eslint-disable-next-line no-restricted-syntax
    this.logEnabled && console.timeEnd(label)
  }
}
