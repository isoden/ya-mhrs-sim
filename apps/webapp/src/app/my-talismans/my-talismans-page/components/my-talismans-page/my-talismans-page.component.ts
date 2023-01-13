import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Clipboard } from '@angular/cdk/clipboard'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { firstValueFrom } from 'rxjs'
import { StoreService } from '~webapp/services/store.service'
import { TalismansPortingService } from '~webapp/services/talismans-porting.service'

const useForm = () => {
  const fb = inject(FormBuilder)

  return fb.nonNullable.group({
    csv: fb.nonNullable.control(''),
  })
}

@Component({
  standalone: true,
  selector: 'app-my-talismans-page',
  templateUrl: './my-talismans-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, UiComponentsModule],
})
export class MyTalismansPageComponent {
  form = useForm()

  talismans$ = this.store.select((state) => state.talismans)

  constructor(
    private readonly store: StoreService,
    private readonly clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private readonly talismansPorting: TalismansPortingService,
  ) {}

  onSubmit(): void {
    const csv = this.form.controls.csv.value.trim()

    if (csv.length === 0) {
      return alert('データを入力してください')
    }

    const result = this.talismansPorting.importFromCsv(csv)

    if (result.errors.length > 0) {
      alert(result.errors)
    }

    if (result.value.length > 0) {
      this.store.update((state) => {
        state.talismans = result.value
      })
    }
  }

  async exportAsCsv(): Promise<void> {
    const csv = this.talismansPorting.exportAsCsv(await firstValueFrom(this.talismans$))

    this.clipboard.copy(csv)
    this.snackBar.open('クリップボードにコピーしました', undefined, {
      duration: 5_000,
      horizontalPosition: 'right',
    })
  }
}
