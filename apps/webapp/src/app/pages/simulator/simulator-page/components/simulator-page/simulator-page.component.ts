import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { UiComponentsModule } from '@ya-mhrs-sim/ui-components'
import { Skill, skills } from '@ya-mhrs-sim/data'
import { mergeMap, Observable, of, Subject, takeUntil } from 'rxjs'
import { every } from 'lodash-es'
import { LocalStorageService } from '~webapp/services/local-storage.service'
import { SimulationResult, SimulatorService } from '~webapp/services/simulator.service'
import { HunterType, WeaponSlots } from '~webapp/models'
import { SimulatorWidgetComponent } from '../simulator-widget/simulator-widget.component'
import { SkillPickerComponent } from '../skill-picker/skill-picker.component'

type ExtractFormValue<T> = T extends FormGroup<infer U>
  ? { [K in keyof U]: ExtractFormValue<U[K]> }
  : T extends FormArray<infer U>
  ? ExtractFormValue<U>[]
  : T extends FormControl<infer U>
  ? U
  : never

const DEFAULT_EXCLUEDED_SKILLS: Skill['name'][] = ['伏魔響命', '龍気活性', '狂竜症【蝕】']

export function useForm(defaultHunterType: HunterType) {
  const fb = inject(FormBuilder)

  return fb.nonNullable.group({
    includedSkills: fb.nonNullable.group(
      skills.reduce(
        (group, skill) => ({ ...group, [skill.name]: 0 }),
        {} as Record<Skill['name'], number>,
      ),
    ),
    excludedSkills: fb.nonNullable.group(
      skills.reduce(
        (group, skill) => ({ ...group, [skill.name]: false }),
        {} as Record<Skill['name'], boolean>,
      ),
    ),
    hunterType: fb.nonNullable.control<HunterType>(defaultHunterType),
    weaponSlots: fb.nonNullable.control(WeaponSlots[0]),
  })
}

export type FormValue = ExtractFormValue<ReturnType<typeof useForm>>

@Component({
  standalone: true,
  selector: 'app-simulator-page',
  templateUrl: './simulator-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiComponentsModule,
    SkillPickerComponent,
    SimulatorWidgetComponent,
  ],
})
export class SimulatorPageComponent implements OnInit, OnDestroy {
  weaponSlots = WeaponSlots
  includedSkills = skills
  excludedSkills = this.includedSkills.filter((skill) =>
    DEFAULT_EXCLUEDED_SKILLS.includes(skill.name),
  )

  #onDestroy = new Subject<void>()

  simulationResult$!: Observable<SimulationResult | null>

  form = useForm(this.localStorage.get('hunterType', 'type01'))

  constructor(
    private readonly localStorage: LocalStorageService<Webapp.LocalStorageSchema>,
    private readonly simulator: SimulatorService,
  ) {}

  ngOnInit(): void {
    // TODO: FormControl が disabled の場合はフィールドが入ってこないため Partial<FormValue> になるのは仕様通りらしい
    this.simulationResult$ = (this.form.valueChanges as Observable<FormValue>).pipe(
      takeUntil(this.#onDestroy),
      mergeMap((value) =>
        // スキルが選択されていない場合は検索せずに null を返す
        every(value.includedSkills, (value) => value === 0)
          ? of(null)
          : this.simulator.solve(value),
      ),
    )

    // ハンタータイプはキャラクター作成時の情報に紐づくためほぼ変更されることはないので一度選択した値は永続化する
    this.form.controls.hunterType.valueChanges
      .pipe(takeUntil(this.#onDestroy))
      .subscribe((kind) => this.localStorage.set('hunterType', kind))
  }

  ngOnDestroy(): void {
    this.#onDestroy.next()
    this.#onDestroy.complete()
  }

  resetForm() {
    const hunterType = this.form.value.hunterType

    this.form.reset({
      hunterType,
    })
  }
}
