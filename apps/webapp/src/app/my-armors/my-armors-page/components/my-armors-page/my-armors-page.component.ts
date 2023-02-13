import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { armors, augmentArmor, AugmentationStatus } from '@ya-mhrs-sim/data'
import { firstValueFrom } from 'rxjs'
import { AugmentationStatusesPortingService } from '~webapp/services/augmentation-statuses-porting.service'
import { StoreService } from '~webapp/services/store.service'
import { SlotComponent } from '~webapp/app/components/slot/slot.component'
import { invariant } from '~webapp/functions/asserts'

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
  imports: [CommonModule, ReactiveFormsModule, UiComponentsModule, SlotComponent],
})
export class MyArmorsPageComponent {
  readonly #store = inject(StoreService)
  readonly #snackBar = inject(MatSnackBar)
  readonly #augmentationStatusesPorting = inject(AugmentationStatusesPortingService)

  readonly form = useForm()
  readonly augmentationStatuses$ = this.#store.select((state) => state.augmentationStatuses)

  getSlots(augmentation: AugmentationStatus) {
    const baseArmor = armors.find((armor) => armor.name === augmentation.name)

    invariant(baseArmor)

    return augmentArmor(baseArmor, augmentation).slots
  }

  onSubmit(): void {
    const csv = this.form.controls.csv.value.trim()

    if (csv.length === 0) {
      return alert('データを入力してください')
    }

    const result = this.#augmentationStatusesPorting.importFromCsv(csv)

    if (result.errors.length > 0) {
      alert(result.errors)
    }

    if (result.value.length > 0) {
      this.#store.update((state) => {
        state.augmentationStatuses = result.value
      })
    }
  }

  async exportAsCsv(): Promise<void> {
    const csv = this.#augmentationStatusesPorting.exportAsCsv(
      await firstValueFrom(this.augmentationStatuses$),
    )

    await navigator.clipboard.writeText(csv)
    this.#snackBar.open('クリップボードにコピーしました', undefined, {
      duration: 5_000,
      horizontalPosition: 'right',
    })
  }
}
