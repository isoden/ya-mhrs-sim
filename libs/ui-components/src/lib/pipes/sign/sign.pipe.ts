import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'sign',
})
export class SignPipe implements PipeTransform {
  transform(value: number, whenZero = '0'): string {
    switch (Math.sign(value)) {
      case 1:
        return `+${value}`

      case -1:
        return `${value}`

      default: {
        return whenZero
      }
    }
  }
}
