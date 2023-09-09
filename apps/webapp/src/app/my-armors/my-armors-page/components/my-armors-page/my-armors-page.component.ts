import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { armors, augmentArmor, AugmentationStatus } from '@ya-mhrs-sim/data'
import { firstValueFrom } from 'rxjs'
import { zip } from 'lodash-es'
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

  page = 1
  readonly pageSize = 100

  get sliceStart() {
    return (this.page - 1) * this.pageSize
  }
  get sliceEnd() {
    return this.sliceStart + this.pageSize
  }

  /**
   * 傀異錬成後防具のスロットと傀異錬成ステータスのスロットをタプルにして返す
   *
   * @param augmentationStatus
   */
  zipSlots(augmentationStatus: AugmentationStatus): [number, number][] {
    const baseArmor = armors.find((armor) => armor.name === augmentationStatus.name)

    invariant(baseArmor)

    const quriousArmor = augmentArmor(baseArmor, augmentationStatus)

    return zip(quriousArmor.slots, augmentationStatus.slots).slice(
      0,
      quriousArmor.slots.length,
    ) as [number, number][]
  }

  /**
   * zipSlots の返り値のスロット情報を読み上げ用テキストに変換する
   *
   * @param slots
   */
  ariaLabel(slots: [number, number][]): string {
    return slots.map(([a, b]) => `${a}${b > 0 ? `(+${b})` : ''}`).join(', ') || 'なし'
  }

  /**
   * インポート処理
   */
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

  /**
   * エクスポート処理
   */
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
