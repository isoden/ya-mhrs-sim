import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { AugmentationsPortingService } from '../../../../../services/augmentations-porting.service'
import { LocalStorageService } from '../../../../../services/local-storage.service'

const useForm = () => {
  const fb = inject(FormBuilder)

  return fb.nonNullable.group({
    csv: fb.nonNullable.control(''),
  })
}

@Component({
  standalone: true,
  selector: 'app-my-armors-page',
  templateUrl: './my-armors-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, UiComponentsModule],
})
export class MyArmorsPageComponent {
  form = useForm()

  augmentations = this.localStorage.get('augmentations', [])

  constructor(
    private readonly localStorage: LocalStorageService<Webapp.LocalStorageSchema>,
    private readonly snackBar: MatSnackBar,
    private readonly augmentationsPorting: AugmentationsPortingService,
  ) {}

  onSubmit(): void {
    const csv = this.form.controls.csv.value.trim()

    if (csv.length === 0) {
      return alert('データを入力してください')
    }

    const result = this.augmentationsPorting.importFromCsv(csv)

    if (result.errors.length > 0) {
      alert(result.errors)
    }

    if (result.value.length > 0) {
      this.localStorage.set('augmentations', result.value)
      this.augmentations = result.value
    }
  }

  async exportAsCsv(): Promise<void> {
    const csv = this.augmentationsPorting.exportAsCsv(this.localStorage.get('augmentations', []))

    await navigator.clipboard.writeText(csv)

    this.snackBar.open('クリップボードにコピーしました', undefined, {
      duration: 5_000,
      horizontalPosition: 'right',
    })
  }
}
