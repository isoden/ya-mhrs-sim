import { CommonModule } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'

@Component({
  standalone: true,
  selector: 'app-software-licenses-page',
  templateUrl: './software-licenses-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HttpClientModule],
})
export class SoftwareLicensesPageComponent {
  readonly license$ = inject(HttpClient).get('/3rdpartylicenses.txt', { responseType: 'text' })
}
