import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { Talisman } from '@ya-mhrs-sim/data'
import { LocalStorageService } from '../../../../../services/local-storage.service'
import { TalismansPortingService } from '../../../../../services/talismans-porting.service'
import { SkillModel } from '../../../../../models'

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

  talismans = this.localStorage
    .get('talismans', [])
    .map(({ skills, slots }) =>
      Talisman.parse({ name: SkillModel.toString(skills), skills, slots }),
    )

  constructor(
    private readonly localStorage: LocalStorageService<Webapp.LocalStorageSchema>,
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
      this.localStorage.set('talismans', result.value)
      this.talismans = result.value
    }
  }

  async exportAsCsv(): Promise<void> {
    const csv = this.talismansPorting.exportAsCsv(this.talismans)

    await navigator.clipboard.writeText(csv)

    this.snackBar.open('クリップボードにコピーしました', undefined, {
      duration: 5_000,
      horizontalPosition: 'right',
    })
  }
}
