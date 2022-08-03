import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'

@Component({
  standalone: true,
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, UiComponentsModule],
})
export class NotFoundPageComponent {}
